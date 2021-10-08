case $1 in
  postgres)
    scp  -i ../pem/sdc.pem ./init.sh ec2-user@ec2-3-17-150-202.us-east-2.compute.amazonaws.com:~/init.sh
    ssh -i ../pem/sdc.pem ec2-user@ec2-3-17-150-202.us-east-2.compute.amazonaws.com
    ;;
  node)
    scp  -i ../pem/sdc.pem ./init.sh ec2-user@ec2-18-119-128-103.us-east-2.compute.amazonaws.com:~/init.sh
    ssh -i ../pem/sdc.pem ec2-user@ec2-18-119-128-103.us-east-2.compute.amazonaws.com
    ;;

esac

