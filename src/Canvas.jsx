import React, { useEffect, useRef } from 'react';
import suzanne_obj from './assets/rat.obj?raw';

function project3DTo2D(xyz){
  //console.log(xyz);  
  let fx = 40;
  let fy = 40;
  let cx = 420;
  let cy = 440;
  let x_offset = 0;
  let y_offset = 0;
  let z_offset = 30.01;

  let n = fx*(xyz[0]+x_offset)/(xyz[2]-z_offset)+cx;
  let m = fy*(xyz[1]+y_offset)/(xyz[2]-z_offset)+cy;
  return [n,m];
}
function Animate(effect, context) {
  context.clearRect(0,0,window.innerWidth, window.innerHeight * 1.1);
  context.fillStyle = "rgb(0, 0, 0)";
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  effect.draw(context);
  effect.update();
  window.requestAnimationFrame(() => Animate(effect, context));
}
function loadobj(objText){
  var obj = {};
  var vertexMatches = objText.match(/^v( -?\d+(\.\d+)?){3}$/gm); // taken from stackoverflow question.
  //console.log(vertexMatches);
  // +g = global, +m = multiline. ^ = startline, "v", search for block  -?\d+(\.\d+)? that appears 3 times.
  // -> space, optional - ,\d digits, \.\d digits after a . which is also optional.
  let faceMatches = [];
  const lines = objText.split("\n");
  for (const line of lines){
    if (line.startsWith("f ")){
       faceMatches.push(line);
    }
  }



  if (vertexMatches)
  {
    obj.vertices = vertexMatches.map(function(vertex)
    {
        var vertices = vertex.split(" ");
        vertices.shift();
        return vertices;
    });
  }
  if (faceMatches){
    obj.faces = faceMatches.map(function(face)
    {
        var unclean_faces = face.split(" ");
        var faces = [];
        for (const unclean_face of unclean_faces) {
            var temp = unclean_face.split("/")[0];
            if (temp!==""){
              faces.push(temp);
            }
        }
        faces.shift();
        return faces;
    });
  }
  return obj;
}


const Canvas = () => {
  const canvasRef = useRef(null);
  const suzanne = loadobj(suzanne_obj);
  console.log(suzanne);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(context);
    };

    const draw = (context) => {
      const effect = new Effect(window.innerWidth, window.innerHeight, suzanne); 
      effect.init();
      //Animate(effect, context);
      context.clearRect(0,0,window.innerWidth, window.innerHeight * 1.1);
      context.fillStyle = "rgb(0, 0, 0)";
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      effect.draw(context);
      effect.update();
      //window.requestAnimationFrame(() => Animate(effect, context));
    };

    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();

    return () => window.removeEventListener('resize', setCanvasSize);
  }, []);

  return <canvas className="Canvas" ref={canvasRef} />;
};

export default Canvas;


class Effect {
  constructor(width, height, object) {
    this.width = width;
    this.height = height;
    this.object = object;
    this.mouse = {
        radius: 10000,
        x: undefined,
        y: undefined
    }
    window.addEventListener('mousemove', event => {
        // added correction factors
        this.mouse.x = event.x;
        this.mouse.y = event.y + window.scrollY;
    })
  }

  init() {
  }
  log(context){
    console.log(this.object);
  }
  draw(context) {
    // we move z from 0 since division by 0 is not allowed 
    // -> cannot be projected unless we have a clipping system 0.1<...<1000 for example
    // draw pseudo box:
    // let points =   [[0,0,5],
    //   [1,0,5],
    //   [1,1,5],
    //   [0,1,5],
    //   [0,0,6],
    //   [1,0,6],
    //   [1,1,6],
    //   [0,1,6]]

    // for (let i = 0; i < 7; i++ ){
    //   context.beginPath();
    //   let point1 = project3DTo2D(points[i]);
    //   let point2 = project3DTo2D(points[i+1]);
    //   context.moveTo(point1[0], point1[1]);
    //   context.lineTo(point2[0], point2[1]);
    //   context.strokeStyle = "#FFFFFF";   
    //   context.lineWidth = 1;
    //   context.stroke();
    // }

    // draw suzanne:
    let points = this.object.vertices;
    let faces = this.object.faces;

    for (let i = 0; i < faces.length; i++ ){
      let face = faces[i];
      for (let j = 0; j< face.length-1; j++){
        console.log("FACE",face,j);
        console.log("POINTS",points[face[parseInt(j)]],points[face[parseInt(j+1)]]);
        //context.beginPath();
        let point1 = project3DTo2D(points[face[parseInt(j)]-1]);
        let point2 = project3DTo2D(points[face[parseInt(j+1)]-1]);
        context.moveTo(point1[0], point1[1]);
        context.lineTo(point2[0], point2[1]);
        context.strokeStyle = "#FFFFFF";   
        context.lineWidth = 1;
        context.stroke();
      }
    }
  }
  update() {
  }
}


