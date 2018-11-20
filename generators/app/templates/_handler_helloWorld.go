package main

import (
	"github.com/aws/aws-lambda-go/lambda"
)

type Event struct {
	Name string `json:"name"`
}

func HandleRequest(event Event) (string, error) {
	return "Hello " + event.Name, nil
}

func main() {
	lambda.Start(HandleRequest)
}
