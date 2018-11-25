#!/bin/bash

START=1
FILE_COUNTS=$FILE_COUNTS

if [ -z ${FILE_COUNTS} ] ; then
  echo "args FILE_COUNTS is not exist. exec again."
  echo "sample: make create-images FILE_COUNTS=100"
  exit 1
fi

function setup(){
	if !(type "convert" > /dev/null 2>&1); then
        echo "convert command is not exist. install start."
        brew install imagemagick
	fi
	if !(type "exiftool" > /dev/null 2>&1); then
        echo "exiftool command is not exist. install start."
        brew install exiftool
    fi
    if !(type "parallel" > /dev/null 2>&1); then
        echo "parallel command is not exist. install start."
        brew install parallel
    fi
}

function create_image() {
    convert -size 100x100 xc:#FF6600 "${PWD}/images/sample$1.jpg"
    exiftool -overwrite_original "${PWD}/images/sample$1.jpg" -comment\<="${PWD}/images/exif.txt" >& /dev/null
}

setup

export -f create_image

echo "image create start" &&
time parallel --bar -j 5 create_image ::: $(seq ${START} ${FILE_COUNTS}) &&
echo "image create finish"
