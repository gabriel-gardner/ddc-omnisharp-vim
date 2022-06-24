# ddc-omnisharp-vim

omnisharp-vim source for ddc.vim

## Required

### ddc.vim

https://github.com/Shougo/ddc.vim

### denops.vim

https://github.com/vim-denops/denops.vim

### omnisharp-vim

https://github.com/OmniSharp/omnisharp-vim

## Configuration examples

```vim
call ddc#custom#patch_global('sources', ['omnisharp-vim'])
call ddc#custom#patch_global('sourceOptions', {
      \ 'omnisharp-vim': {'mark': 'OMNI'},
      \ })
```

## Original version

https://github.com/OmniSharp/omnisharp-vim/blob/master/rplugin/python3/deoplete/sources/deoplete_OmniSharp.py
