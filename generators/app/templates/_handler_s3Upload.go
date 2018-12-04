package main

import (
	"fmt"
	"log"
	"os"

	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"golang.org/x/sync/errgroup"
)

const (
	UploadBucketName        = "<%= props.boilerplateOptions.uploadBucketName %>"
	DownloadPath            = "./tmp/download"
	UploadPath              = "./tmp/upload"
	MaximumNumberOfParallel = 10
)

func HandleRequest(ctx context.Context, event events.S3Event) (string, error) {
	zipFileName, err := download(DownloadPath, event.Records[0].S3.Object.Key, event.Records[0].S3.Bucket.Name)
	if err != nil {
		return "", err
	}
	var f File
	filenames, err := f.Unzip(zipFileName, UploadPath)
	if err != nil {
		log.Fatal(err)
	}
	eg := errgroup.Group{}
	c := make(chan int, MaximumNumberOfParallel)
	for _, filename := range filenames {
		filename := filename
		eg.Go(func() error {
			return upload(filename, UploadBucketName, c)
		})
	}
	if err := eg.Wait(); err != nil {
		log.Fatal(err)
	}
	return "", nil
}

func download(path, key, bucket string) (string, error) {
	var f File
	err := f.RemoveDir(path)
	if err != nil {
		return "", err
	}
	os.MkdirAll(path, 0755)
	zipFile, _ := os.Create(path + "/" + key)
	defer zipFile.Close()
	s3 := &S3Object{Key: key, Bucket: bucket}
	s3.Init()
	downloadErr := s3.Download(zipFile)
	if downloadErr != nil {
		return "", downloadErr
	}
	return zipFile.Name(), nil
}

func upload(key, bucket string, c chan int) error {
	c <- 1
	defer func() {
		<-c
	}()
	file, err := os.Open(fmt.Sprintf("%s", key))
	if err != nil {
		return err
	}
	defer file.Close()
	s3 := &S3Object{Key: key, Bucket: bucket}
	s3.Init()
	err = s3.Upload(file)
	if err != nil {
		return err
	}
	return nil
}

func main() {
	lambda.Start(HandleRequest)
}
