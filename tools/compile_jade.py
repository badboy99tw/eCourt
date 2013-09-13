#!/usr/bin/env python

import os
import sys

def compile_jade(src, desDir):
    srcDir = os.path.split(src)[0]
    name = os.path.splitext(os.path.split(src)[-1])[0]
    tmp = os.path.join(srcDir, name+'.js')
    des = os.path.join(desDir, name+'.js')

    cmd = 'jade --client --no-debug %s' % src
    os.system(cmd)
    cmd = 'mv %s %s' % (tmp, des)
    os.system(cmd)

if __name__ == '__main__':
    compile_jade(sys.argv[1], sys.argv[2]);
