#!/bin/bash
kubectl exec -it mongod-0 -- mongo --eval "rs.initiate({_id: 'MainRepSet', version: 1, members: [{ _id: 0, host : 'mongod-0.mongodb-service.kubetest.svc.cluster.local:27017' },{ _id: 1, host : 'mongod-1.mongodb-service.kubetest.svc.cluster.local:27017' },{ _id: 2, host : 'mongod-2.mongodb-service.kubetest.svc.cluster.local:27017' }]});"
kubectl exec -it mongod-0 -- mongo --eval "rs.status();"
kubectl exec -it mongod-0 -- mongo --eval "while (rs.status().hasOwnProperty('myState') && rs.status().myState != 1) { print('.'); sleep(1000); }; 'db.getSiblingDB("admin").createUser({user:"'"${MONGO_INITDB_ROOT_USERNAME}"'",pwd:"'"${MONGO_INITDB_ROOT_PASSWORD}"'",roles:[{role:"root",db:"admin"}]});'

kubectl exec -it mongod-0 -- mongo --eval 'db.getSiblingDB("admin").createUser({user:"'"${MONGO_INITDB_ROOT_USERNAME}"'",pwd:"'"${MONGO_INITDB_ROOT_PASSWORD}"'",roles:[{role:"root",db:"admin"}]});'


NO
kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB('admin').createUser({user:$(MONGO_INITDB_ROOT_USERNAME),pwd:$(MONGO_INITDB_ROOT_PASSWORD),roles:[{role:'root',db:'admin'}]});"
kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB('admin').createUser({user:${MONGO_INITDB_ROOT_USERNAME},pwd:${MONGO_INITDB_ROOT_PASSWORD},roles:[{role:'root',db:'admin'}]});"
kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB('admin').createUser({user:\$\{MONGO_INITDB_ROOT_USERNAME\},pwd:\$\{MONGO_INITDB_ROOT_PASSWORD\},roles:[{role:'root',db:'admin'}]});"
kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB('admin').createUser({user:\${MONGO_INITDB_ROOT_USERNAME},pwd:\${MONGO_INITDB_ROOT_PASSWORD},roles:[{role:'root',db:'admin'}]});"
kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB('admin').createUser({user:\$(MONGO_INITDB_ROOT_USERNAME),pwd:\$(MONGO_INITDB_ROOT_PASSWORD),roles:[{role:'root',db:'admin'}]});"
kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB('admin').createUser({user:\'$MONGO_INITDB_ROOT_USERNAME\',pwd:\'$MONGO_INITDB_ROOT_PASSWORD\',roles:[{role:'root',db:'admin'}]});"
kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB('admin').createUser({user:\'$MONGO_INITDB_ROOT_USERNAME',pwd:\'$MONGO_INITDB_ROOT_PASSWORD',roles:[{role:'root',db:'admin'}]});"
kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB('admin').createUser({user:\'$(MONGO_INITDB_ROOT_USERNAME)\',pwd:\'$(MONGO_INITDB_ROOT_PASSWORD)\',roles:[{role:'root',db:'admin'}]});"
kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB(\"admin\").auth(\"$MONGO_INITDB_ROOT_USERNAME\", \"$MONGO_INITDB_ROOT_PASSWORD\"); db.getSiblingDB(\"admin\").createUser({user:\"'\"${MONGO_INITDB_ROOT_USERNAME}\"'\",pwd:\"'\"${MONGO_INITDB_ROOT_PASSWORD}\"'\",roles:[{role:\"root\",db:\"admin\"}]})"
kubectl exec -it mongod-0 -- mongo --eval db.getSiblingDB(\"admin\").createUser({user:\"'\"${MONGO_INITDB_ROOT_USERNAME}\"'\",pwd:\"'\"${MONGO_INITDB_ROOT_PASSWORD}\"'\",roles:[{role:\"root\",db:\"admin\"}]})"

WORK
kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB('admin').createUser({user:\"\$(MONGO_INITDB_ROOT_USERNAME)\",pwd:\"\$(MONGO_INITDB_ROOT_PASSWORD)\",roles:[{role:'root',db:'admin'}]});" - "$(MONGO_INITDB_ROOT_USERNAME)"
kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB('admin').createUser({user:\$\{MONGO_INITDB_ROOT_USERNAME\},pwd:\$\{MONGO_INITDB_ROOT_PASSWORD\},roles:[{role:'root',db:'admin'}]})"
db.createUser({user: "<username>",pwd: "<password>", roles: [{ role: "readWrite", db: "<dbName>" }, "clusterAdmin"]})

mongo cdt_db --eval "db.users.update({username:'${USER}'}, {\$set:{roles:['Admin']}});"

WORKKK within pod
mongo --eval 'db.getSiblingDB("admin").auth("$MONGO_INITDB_ROOT_USERNAME", "$MONGO_INITDB_ROOT_PASSWORD"); 
mongo --eval 'db.getSiblingDB("admin").createUser({user:"'"${MONGO_INITDB_ROOT_USERNAME}"'",pwd:"'"${MONGO_INITDB_ROOT_PASSWORD}"'",roles:[{role:"root",db:"admin"}]});'

kubectl exec -it mongod-0 -- mongo --eval "db.getSiblingDB('admin').createUser({user:_MONGO_INITDB_ROOT_USERNAME,pwd:_$(MONGO_INITDB_ROOT_PASSWORD),roles:[{role:'root',db:'admin'}]});"

db.getSiblingDB("admin").dropUser("dudung")
kubectl exec -it mongod-0 -- mongo --eval "print('MONGO_INITDB_ROOT_USERNAME');"

(\"$MONGO_INITDB_ROOT_USERNAME\")
