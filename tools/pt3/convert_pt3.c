/* Offline PT3 -> AY frame conversion for NEOLINE.
 * Underlying player: Volutar/pt3player (MIT), see tools/pt3/LICENSE.
 * Output: exact 14-byte AY register snapshots @ 50 Hz, chip emulated in browser.
 * Playback stops on the original module position loop and loops seamlessly.
 */
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "pt3player.c"

int main(int argc,char **argv){
 if(argc<3){fprintf(stderr,"Usage: pt3_to_ay input.pt3 output.ay14\n");return 2;}
 FILE *in=fopen(argv[1],"rb");if(!in){perror(argv[1]);return 2;}
 if(fseek(in,0,SEEK_END)!=0){fclose(in);return 2;}
 long n=ftell(in);
 if(n<201||n>65536){fprintf(stderr,"Invalid PT3 length %ld\n",n);fclose(in);return 2;}
 rewind(in);
 uint8_t *module=(uint8_t*)calloc((size_t)n+65536,1);
 if(!module){fclose(in);return 2;}
 if(fread(module,1,(size_t)n,in)!=(size_t)n){perror("read");fclose(in);free(module);return 2;}
 fclose(in);
 int channels=func_setup_music(module,(int)n,0,0);
 if(channels!=1){
   fprintf(stderr,"Expected single AY PT3 chip, decoder returned %d\n",channels);
   free(module);return 3;
 }
 FILE *out=fopen(argv[2],"wb");if(!out){perror(argv[2]);free(module);return 2;}
 unsigned int frames=0;int wrapped=0;
 uint8_t regs[14]={0},prev_pos=PlParams[0].PT3.CurrentPosition;
 // 50 Hz frame rate, up to 4 minutes as a defensive bound.
 while(frames<50*240){
  func_play_tick(0);
  func_getregs(regs,0);
  if(fwrite(regs,1,14,out)!=14){fprintf(stderr,"write failed\n");fclose(out);free(module);return 2;}
  frames++;
  uint8_t pos=PlParams[0].PT3.CurrentPosition;
  // Original player wraps to module's loop position on last order.
  if(pos<prev_pos && frames>50){wrapped=1;break;}
  prev_pos=pos;
 }
 fclose(out);
 fprintf(stderr,"PT3 conversion: %s -> %u frames (%.2fs) wrap=%d\n",
   argv[1],frames,frames/50.0,wrapped);
 free(module);
 if(!wrapped){fprintf(stderr,"No module loop detected before safety bound\n");return 4;}
 return 0;
}
