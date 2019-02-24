#!/bin/bash

echo ""
read -p "Username: " USER
read -s -p "Password: " PASSWORD
echo ""

RESP=`curl -s -d "{\"username\": \"$USER\", \"password\":\"$PASSWORD\"}" -H "Content-type: application/json" https://orion.lab.fiware.org/token`

TOKEN=`echo $RESP`
echo -e "\nToken: $TOKEN"
echo ""

#echo $(curl -s -d "{\"username\": \"admin@test.com\", \"password\":\"1234\"}" -H "Content-type: application/json" http://35.192.111.69:3000/v2.0/tokens)