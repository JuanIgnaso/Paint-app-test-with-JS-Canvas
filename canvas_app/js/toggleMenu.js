let shortcutMenu = document.querySelector('div #shortcuts-menu');

document.addEventListener('click',function(event){
    if (!event.target.matches('#shortcuts')) {
        shortcutMenu.classList.replace('block','hidden');
    }
});

function seeShortcuts(){
    if(shortcutMenu.classList.contains('block')){
        shortcutMenu.classList.replace('block','hidden');
    }else{
        shortcutMenu.classList.replace('hidden','block');
    }
}