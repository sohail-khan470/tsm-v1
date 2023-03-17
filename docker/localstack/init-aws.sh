#!/bin/bash
awslocal s3 mb s3://taskmanager-attachments
awslocal s3api put-bucket-cors --bucket taskmanager-attachments --cors-configuration file:///tmp/cors.json