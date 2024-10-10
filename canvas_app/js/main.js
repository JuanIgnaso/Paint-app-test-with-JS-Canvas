        /*VARIABLES Y CONSTANTES**********************************************************************************/

        const canvas = document.getElementById("mainCanvas");

        let ctx = canvas.getContext("2d"); //dar contexto, en este caso dibujo 2D.

        let strokeCurrentColor = '#000000'; //Guarda el color actual

        let fillCurrentColor = '#ffffff'; //Guarda el color de relleno actual

        ctx.strokeStyle = strokeCurrentColor; //Color por defecto del pincel.

        const brush_color = document.querySelector('#brush_color'); //Input de color para cambiar el color del trazo.

        const fill_color = document.querySelector('#fill_color'); //Input de color para cambiar color del relleno

        const fill_menu = document.querySelector('#fill_figure_menu');

        let shapeStart,isMousePressed = false; //flags para saber si está empezada una figura o si el ratón está siendo presionado

        let coords = {x:0,y:0}; //Coordenandas del ratón

        let toolType;

        let redo_array,undo_array = [];

        let shape = {'x':undefined,'y':undefined,'width':undefined,'height':undefined}; //arc(x,y,diametro,0, Math.PI * 2,true)

        /************************************************************************************************/

        //FUNCIONES----------------------------------------------------------------------------------

        /*
        Recoge y actualiza la posición del ratón del usuario.
        */
        function getPosition(event){
            /*evitar que desincronice la posición del pincel al hacer scroll*/
            coords.x = (event.clientX - canvas.getBoundingClientRect().left) / canvas.getBoundingClientRect().width * canvas.getBoundingClientRect().width;
            coords.y = (event.clientY - canvas.getBoundingClientRect().top) / canvas.getBoundingClientRect().height * canvas.getBoundingClientRect().height;
        }

       /*
       Convertir el canvas en imagen para que el usuario la pueda descargar como imágen.
       */
       function saveDrawing(){
            localStorage.setItem('lastDrawing',canvas.toDataURL('image/png'));
            window.open('./saveCanvas.html','_self'); //redirige el usuario a saveCanvas.html
       }

        /*
        Función encargada de realizar un trazado cuando el usuario mueve el ratón manteniendo presionado.
        */
        function draw(event) {
            if(isMousePressed){
                ctx.lineCap = 'round';

                /*Si se usa la goma se cambia a color blanco, si no se vuelve al color actual*/
                ctx.strokeStyle = toolType == 'eraser' ? '#ffffff' : strokeCurrentColor;

                if(toolType == 'eraser' || toolType == 'pencil'){
                    drawPath(event);
                }

            }
        }

        /*Dibuja el trazado en el canvas*/
        function drawPath(event){
            ctx.beginPath();
            ctx.moveTo(coords.x,coords.y);
            getPosition(event);
            ctx.lineTo(coords.x,coords.y);
            ctx.stroke();
        }

        /*
        Cambia la forma con la cual se interactua con el canvas dependiendo del valor que tenga la variable
        'toolType'
        */
        function useTool(event){
            //Dibujar línea
            if(toolType == 'line'){
                ctx.strokeStyle = strokeCurrentColor;
                getPosition(event);
                if(!shapeStart){
                    shapeStart = true;
                    ctx.beginPath();
                    ctx.moveTo(coords.x,coords.y);
                    showRef(event);
                }else{
                    ctx.lineTo(coords.x,coords.y);
                    ctx.stroke();
                    shapeStart = false;
                    save_last();
                    removeRef();
                }
            }
            //Dibujar cuadrado
            if(toolType == 'square'){
                //<div class="absolute w-4 h-4 border-2 rounded-full border-blue-600/50 bg-blue-300/50"></div>
                if(!shapeStart){
                    shapeStart = true;
                    getPosition(event);
                    shape.x = coords.x;
                    shape.y = coords.y;
                    showRef(event);
                }else{
                    getPosition(event);
                    shape.height = coords.y - shape.y;
                    shape.width = coords.x - shape.x;

                    if(document.querySelector('#fillyes').checked){
                    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
                    }

                    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                    shape.x = shape.y = shape.width = shape.height = undefined;
                    shapeStart = false;
                    save_last();
                    removeRef();
                }
            }
            //Dibujar un círculo
            if(toolType == 'circle'){
                console.log(toolType);
                getPosition(event);
                if(!shapeStart){
                    shapeStart = true;
                    ctx.beginPath();
                    shape.x = coords.x;
                    shape.y = coords.y;
                    showRef(event);
                }else{
                    getPosition(event);
                    ctx.arc(shape.x,shape.y,Math.abs(coords.x - shape.x),0, Math.PI * 2,coords.x >= circle.x);
                    if(document.querySelector('#fillyes').checked){
                        ctx.fill();
                    }
                    ctx.stroke();
                    shape.x = shape.y = undefined;
                    shapeStart = false;
                    removeRef();
                    save_last();
                }
            }
            //Cuentagotas
            if(toolType == 'color_picker'){
                let color = ctx.getImageData(coords.x,coords.y,1,1).data;
                strokeCurrentColor = `rgb(${color[0]},${color[1]},${color[2]})`;
                ctx.strokeStyle = strokeCurrentColor;
            }
        }

        /*Muestra la referencia del último punto*/
        function showRef(event){
            var ref = document.createElement('div');
            ref.setAttribute('id','ref');
            ref.setAttribute('class','reference');
            ref.style.left = event.pageX + 'px';
            ref.style.top = event.pageY + 'px';
            document.body.appendChild(ref);
        }

        removeRef = () =>{document.querySelector('#ref').remove();}; //Eliminar referencia

        /*Limpiar el canvas*/
        function clearCanvas(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.rect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            undo_array = redo_array = [];
        }

        /*Guarda la última acción hecha por el usuario(llamar función cada vez que el usuario realiza algo dentro del canvas)*/
        function save_last(){
            undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
            redo_array = [];
        }

        /*Se encargar del historial del dibujo*/
        function undoRedo(pushStack,popStack){
                pushStack.push(popStack.pop());
                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.putImageData(undo_array[undo_array.length - 1],0,0);
        }

        /*Controla la función de deshacer*/
        function handleUndo(){
            undo_array.length > 1 ? undoRedo(redo_array,undo_array) : ctx.clearRect(0,0,canvas.width,canvas.height);
            console.log(redo_array.length);
        }

        /*Controla la función de rehacer*/
        function handleRedo(){
            redo_array.length >= 1 ? undoRedo(undo_array,redo_array) : '';
        }

        function toggleTool(e){
                e.checked = true;
                toolType = e.getAttribute('id');
        }

        /*EVENTLISTENERS**********************************************************************************/
        /*
        Se cargan los siguientes eventlisteners al cargar la página
        */
        window.addEventListener('load',()=>{

            /*Setea el tamaño*/
            ctx.canvas.height = window.innerHeight;
            ctx.canvas.width = window.innerWidth;

            /*Define el color de fondo del canvas y evita que quede transparente*/
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            toolType = 'pencil';

            /*COMPORTAMIENTO DEL PINCEL*/
            document.querySelector('#clear_canvas').addEventListener('click',clearCanvas); //Limpiar el canvas

            canvas.addEventListener('mousedown',(e)=> {isMousePressed = true; getPosition(e)});

            canvas.addEventListener("mousemove", draw);

            document.addEventListener('mouseup',function(){
                isMousePressed = false;
                save_last();
            });

            canvas.addEventListener('click',(e)=>useTool(e));

            /*---------------------------------------------*/

            /*Muestra al usuario el color actual del pincel y del relleno--*/
            brush_color.addEventListener('change',function(){
                ctx.strokeStyle = strokeCurrentColor = this.value;
                document.querySelector('#curr_stroke_color').style.backgroundColor = this.value;
            });

            fill_color.addEventListener('change',function(){
                ctx.fillStyle = fillCurrentColor = this.value;
                document.querySelector('#curr_fill_color').style.backgroundColor = this.value;
            });
            /*-----------------------------------------------------------*/

            /*CAMBIAR GROSOR DEL PINCEL-----------------------------------*/
            document.querySelector('#brush_thickess').addEventListener('change',function(){
                ctx.lineWidth = Number(this.value);
            });

            /*HACER Y DESHACER CAMBIOS-------------------------------------*/
            document.querySelector("#undo_btn").addEventListener('click',handleUndo);

            document.querySelector('#redo_btn').addEventListener('click',handleRedo);

            /*
            //--SHORTCUTS PARA EL USUARIO--//
                p -> pencil
                l -> line
                s -> square
                c -> circle
                e -> eraser
                x -> color picker
            */
            document.addEventListener('keypress',function(e){


                switch(String.fromCharCode(e.keyCode).toLowerCase()){

                    case 'u':
                        handleUndo();
                        break;

                    case 'r':
                        handleRedo();
                        break;

                    case 'p':
                        toggleTool(document.querySelector("input[id='pencil']"));
                        break;

                    case 'l':
                        toggleTool(document.querySelector("input[id='line']"));
                        break;

                    case 's':
                        toggleTool(document.querySelector("input[id='square']"));
                        break;

                    case 'c':
                        toggleTool(document.querySelector("input[id='circle']"));
                        break;

                    case 'e':
                        toggleTool(document.querySelector("input[id='eraser']"));
                        break;

                    case 'x':
                        toggleTool(document.querySelector("input[id='color_picker']"));
                        break;
                }

            });

            /*-------------------------------------------------------------*/
            /*
            Añadir evento a las herramientas para cambiar el 'toolType' actual, si es 'circle' o 'square' se muestra un menú de relleno
            */
            document.querySelectorAll("input[name='tool']").forEach(element => {

                element.addEventListener("change", function(e){

                    toggleTool(element);

                    if(toolType == 'circle' || toolType == 'square'){
                        fill_menu.classList.replace('hidden','flex');
                    }else{
                        fill_menu.classList.replace('flex','hidden');
                    }
                });
            });
        });
