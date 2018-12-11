#!/bin/bash

START=1
FILE_COUNTS=$FILE_COUNTS
IMAGE_SIZE=413
FILE_SIZE=$(($FILE_SIZE*1024-$IMAGE_SIZE))

if [ -z ${FILE_COUNTS} ] ; then
  echo "args FILE_COUNTS is not exist. exec again."
  echo "sample: make create-images FILE_COUNTS=100"
  exit 1
fi

function setup(){
    if [ ! -e images ]; then
        mkdir images
    fi
    if [ ! -e images/exif.txt ]; then
        touch images/exif.txt &&
        dd if=/dev/zero of=images/exif.txt bs=1 count=${FILE_SIZE}
    fi
	if !(type "convert" > /dev/null 2>&1); then
        echo "convert command is not exist. install start."
        brew install imagemagick
	fi
    if !(type "parallel" > /dev/null 2>&1); then
        echo "parallel command is not exist. install start."
        brew install parallel
    fi
}

function tearDown() {
    rm images/exif.txt
}

function create_image() {
    convert -size 100x100 xc:#FF6600 "${PWD}/images/sample$1.jpg"
    # FIXME: exiftool comment byte size is diff.
    exiftool -overwrite_original "${PWD}/images/sample$1.jpg" -comment\<="${PWD}/images/exif.txt" >& /dev/null
}

export -f create_image

echo "image create start" &&
setup &&
time parallel --bar -j 5 create_image ::: $(seq ${START} ${FILE_COUNTS}) &&
echo "image create finish" &&
tearDown