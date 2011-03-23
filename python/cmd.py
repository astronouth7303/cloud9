#!/usr/bin/python
import sys,os

if(len(sys.argv) <= 1):
    sys.exit(0)
else:
    os.system(' '.join(sys.argv[1:]))