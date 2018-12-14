package main

import (
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

const (
	EndPoint = "<%= props.boilerplateOptions.endpoint %>"
	Region   = "<%= props.boilerplateOptions.region %>"
)

type S3Config struct {
	Region string
}

type S3Object struct {
	Key     string
	Bucket  string
	Session *session.Session
}

func (so *S3Object) Init() {
	so.Session = session.Must(session.NewSession(&aws.Config{
		S3ForcePathStyle: aws.Bool(true),
		Endpoint:         aws.String(EndPoint),
		Region:           aws.String(Region),
	}))
}

func (so *S3Object) Download(f *os.File) error {
	downloader := s3manager.NewDownloader(so.Session)
	_, err := downloader.Download(f, &s3.GetObjectInput{
		Bucket: aws.String(so.Bucket),
		Key:    aws.String(so.Key),
	})
	if err != nil {
		return err
	}
	return nil
}

func (so *S3Object) Upload(f *os.File) error {
	uploader := s3manager.NewUploader(so.Session)
	_, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(so.Bucket),
		Key:    aws.String(so.Key),
		Body:   f,
	})
	if err != nil {
		return err
	}
	return nil
}
