#!/bin/bash
modprobe fuse 
dmesg | grep -i fuse 
sudo modprobe dm_snapshot 
sudo modprobe dm_mirror 
sudo modprobe dm_thin_pool 
lsmod | grep dm_*
#sudo apt-get remove glusterfs-client
sudo apt-get install -y software-properties-common
sudo add-apt-repository ppa:gluster/glusterfs-4.1 
sudo apt-get -y update 
sudo apt-get -y install glusterfs-client 
sudo apt-get -y install attr
#edit #!/bin/bash` at the start of mount.glusterfs
#replace "#!/bin/sh" "#!/bin/bash" -- /sbin/mount.glusterfs -- does not work
sudo sed -i '1s/'sh'/'bash'/g' /sbin/mount.glusterfs
mount.glusterfs -V
sudo fdisk -l 
sudo wipefs -a /dev/sdb -f
sudo iptables -A INPUT -p tcp --dport 8080 --jump ACCEPT
sudo iptables -A INPUT -p tcp --dport 2222 --jump ACCEPT
sudo iptables -A INPUT -p tcp --dport 24007:24008 --jump ACCEPT
sudo iptables -A INPUT -p tcp --dport 49152:49156 --jump ACCEPT
#sudo iptables -A INPUT -p tcp --dport 30000:32000 --jump ACCEPT


kubectl delete ds glusterfs
sudo rm -Rf /var/lib/heketi /etc/glusterfs /var/lib/glusterd /var/log/glusterfs /var/lib/misc/glusterfsd \ 
&& sudo wipefs -a /dev/sdb -f \
&& sudo dd if=/dev/zero of=/dev/sdc bs=1 count=10
systemctl 

sudo add-apt-repository ppa:gluster/glusterfs-4.1 \
&& sudo apt-get -y update \
&& sudo apt-get -y install glusterfs-client \
&& sudo sed -i '1s/'sh'/'bash'/g' /sbin/mount.glusterfs \
&& mount.glusterfs -V
