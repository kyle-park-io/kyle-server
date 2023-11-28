#!/bin/sh

# create a virtual environment, to avoid conflicts
python3 -m venv /app/certbot_venv

# use the pip in the virtual environment to install or update
/app/certbot_venv/bin/pip install -U certbot-dns-godaddy
