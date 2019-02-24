#!/bin/bash
size=$1
pvc=$(kubectl get statefulset/mongodb -o jsonpath='{.spec.volumeClaimTemplates[0].metadata.name}')
if ! kubectl patch pvc $pvc-mongodb-0 -p '{"status":{"capacity":{"storage":"'"$size"'"}}}';
  then 
    for p in `seq 0 $(expr $(kubectl get -o template statefulset/mongodb --template={{.spec.replicas}}) - 1)`
        do kubectl patch pv $(kubectl get pv | grep $pvc-mongodb-$p | awk '{print $1}') -p '{"spec":{"capacity":{"storage":"'"$size"'"}}}' | kubectl patch pvc $pvc-mongodb-$p -p '{"spec":{"resources":{"requests":{"storage":"'"$size"'"}}}}'
  done
fi
