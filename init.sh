sudo yum update -y
sudo yum install git -y
sudo yum install docker -y

git clone https://github.com/The-Transplants/Ratings-and-Reviews.git


# installing docker compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /urs/local/bin/docker-compose
docker-compose version

#start docker
sudo service docker start
sudo usermod -a -G docker ec2-user