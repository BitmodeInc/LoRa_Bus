#!/bin/bash

# ตรวจสอบว่า network main_revert_proxy มีอยู่หรือไม่
if ! docker network ls | grep -q "main_revert_proxy"; then
  echo "Network 'main_revert_proxy' does not exist. Creating..."
  docker network create main_revert_proxy
else
  echo "Network 'main_revert_proxy' already exists."
fi

# รัน docker compose
docker compose up -d