#!/usr/bin/env sh
# Ждёт доступности TCP-сервера
# Использование: ./wait-for-it.sh host:port -- команда

host_port="$1"
shift
cmd="$@"

host=$(echo $host_port | cut -d: -f1)
port=$(echo $host_port | cut -d: -f2)

until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 1
done

exec $cmd
