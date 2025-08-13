terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "ap-south-1"
}

resource "aws_s3_bucket" "rohit_personal_bucket" {
  bucket = "rohit-personal-bucket1"
}

resource "aws_s3_bucket_public_access_block" "Policy_update" {
  bucket = aws_s3_bucket.rohit_personal_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "dashboard" {
  bucket = aws_s3_bucket.rohit_personal_bucket.id
    policy = jsonencode(
        {
             Version = "2012-10-17",
             Statement = [
             {
                 Sid = "PublicReadGetObject",
                 Effect = "Allow",
                 Principal = "*",
                 Action = "s3:GetObject",
                 Resource = "arn:aws:s3:::${aws_s3_bucket.rohit_personal_bucket.id}/*"
             }
          ]
      }
    )
}


resource "aws_s3_bucket_website_configuration" "dashboard" {
  bucket = aws_s3_bucket.rohit_personal_bucket.id

  index_document {
    suffix = "index.html"
  }

}

resource "aws_s3_object" "index_html" {
  bucket = aws_s3_bucket.rohit_personal_bucket.bucket
  source = "D:/vm/dashboard/index.html"
  key = "index.html"
  content_type = "text/html"

}

resource "aws_s3_object" "style_css" {
  bucket = aws_s3_bucket.rohit_personal_bucket.bucket
  source = "D:/vm/dashboard/style.css"
  key = "style.css"
  content_type = "text/css"

}

resource "aws_s3_object" "script_js" {
  bucket = aws_s3_bucket.rohit_personal_bucket.bucket
  source = "D:/vm/dashboard/script.js"
  key = "script.js"
  content_type = "text/javascript"

}

output "name" {
  value = aws_s3_bucket_website_configuration.dashboard.website_endpoint
}