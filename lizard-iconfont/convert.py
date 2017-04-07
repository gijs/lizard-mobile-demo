#!/usr/bin/python

""" Usage:

fontforge --script convert.py
"""

import sys
import fontforge


NAME = 'LizardIcons'
EXTENSIONS = ['woff', 'eot', 'ttf', 'svg']


def main(argv):
    src = fontforge.open('originals/{}.sfd'.format(NAME))
    for ext in EXTENSIONS:
        src.generate('fonts/{}.{}'.format(NAME, ext))


if __name__ == '__main__':
    main(sys.argv[1:])
