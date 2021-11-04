case $1 in
  postgres)
    scp -i ../pem/sdc.pem ./init.sh ec2-user@ec2-3-15-153-141.us-east-2.compute.amazonaws.com:~/init.sh
    ssh -i ../pem/sdc.pem ec2-user@ec2-3-15-153-141.us-east-2.compute.amazonaws.com
    ;;
  node)
    # scp -i ../pem/sdc.pem ./init.sh ec2-user@ec2-3-135-204-176.us-east-2.compute.amazonaws.com:~/init.sh
    ssh -i ../pem/sdc.pem ec2-user@ec2-3-135-204-176.us-east-2.compute.amazonaws.com
    ;;
esac

# scp -i ../pem/sdc.pem ./reviews/characteristic_reviews.csv ec2-user@ec2-3-135-204-176.us-east-2.compute.amazonaws.com:~/Ratings-and-Reviews/characteristic_reviews.csv
# scp -i ../pem/sdc.pem ./reviews/characteristics.csv ec2-user@ec2-3-135-204-176.us-east-2.compute.amazonaws.com:~/Ratings-and-Reviews/characteristics.csv
# scp -i ../pem/sdc.pem ./reviews/reviews_photos.csv ec2-user@ec2-3-135-204-176.us-east-2.compute.amazonaws.com:~/Ratings-and-Reviews/reviews_photos.csv
# scp -i ../pem/sdc.pem ./reviews/reviews.csv ec2-user@ec2-3-135-204-176.us-east-2.compute.amazonaws.com:~/Ratings-and-Reviews/reviews.csv