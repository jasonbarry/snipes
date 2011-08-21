#!/usr/bin/perl

use strict;
use warnings;

print "Content-type: application/javascript\n\n";

print "{\"ip\":\"".$ENV{'REMOTE_ADDR'}."\",".
        "\"ref\":\"".$ENV{'HTTP_REFERER'}."\",".
        "\"lang\":\"".$ENV{'HTTP_ACCEPT_LANGUAGE'}."\"}";

1;