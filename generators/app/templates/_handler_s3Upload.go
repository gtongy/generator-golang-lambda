package main

import (
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"golang.org/x/sync/errgroup"
)

const (
	TmpZipFileName          = "tmp.zip"
	BucketName              = "<%= props.boilerplateOptions.bucketName %>"
	MaximumNumberOfParallel = 10
)

type Event struct {
	ID   string `json: "id"`
	File string `json: "file"`
}

func HandleRequest(event Event) (string, error) {
	var f File
	f.Decode(event.File, TmpZipFileName)
	filenames, err := f.Unzip(TmpZipFileName, event.ID)
	if err != nil {
		log.Fatal(err)
	}
	eg := errgroup.Group{}
	c := make(chan int, MaximumNumberOfParallel)
	for _, filename := range filenames {
		filename := filename
		eg.Go(func() error {
			return upload(filename, c)
		})
	}
	if err := eg.Wait(); err != nil {
		log.Fatal(err)
	}
	return event.ID, nil
}

func upload(filename string, c chan int) error {
	c <- 1
	defer func() {
		<-c
	}()
	file, err := os.Open(fmt.Sprintf("%s", filename))
	if err != nil {
		return err
	}
	defer file.Close()
	s3 := &S3Object{Key: filename, Bucket: BucketName}
	s3.Init()
	_, err = s3.Upload(file)
	if err != nil {
		return err
	}
	return nil
}

func main() {
	lambda.Start(HandleRequest)
}
