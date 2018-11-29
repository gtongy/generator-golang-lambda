package main

import (
	"log"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

const EndPoint = "<%= props.boilerplateOptions.endpoint %>"

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
		Region:           aws.String(endpoints.ApNortheast1RegionID),
	}))
}

func (so *S3Object) Upload(f *os.File) (*s3manager.UploadOutput, error) {
	uploader := s3manager.NewUploader(so.Session)

	// Upload the file to S3.
	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(so.Bucket),
		Key:    aws.String(so.Key),
		Body:   f,
	})
	if err != nil {
		log.Fatalf("failed to upload file, %v", err)
	}
	return result, err
}
