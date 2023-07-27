#!/bin/bash

MY_IP=$(hostname -i)
sed -i 's/'IP=".*"'/'IP=\"$MY_IP\"'/' ".env";
