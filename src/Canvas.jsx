import React, { useEffect, useRef } from 'react';
import suzanne_obj from './assets/suzanne.obj?raw';

function project3DTo2D(xyz){
  let fx = 400;
  let fy = 400;
  let cx = 320;
  let cy = 240;

  let n = fx*xyz[0]/xyz[2]+cx;
  let m = fy*xyz[1]/xyz[2]+cy;
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
        var faces = face.split(" ");
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
      const effect = new Effect(window.innerWidth, window.innerHeight); 
      effect.init();
      Animate(effect, context);
    };

    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();

    return () => window.removeEventListener('resize', setCanvasSize);
  }, []);

  return <canvas className="Canvas" ref={canvasRef} />;
};

export default Canvas;


class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
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
  draw(context) {
    // we move z from 0 since division by 0 is not allowed 
    // -> cannot be projected unless we have a clipping system 0.1<...<1000 for example
    let points =   [[0,0,5],
      [1,0,5],
      [1,1,5],
      [0,1,5],
      [0,0,6],
      [1,0,6],
      [1,1,6],
      [0,1,6]]

    for (let i = 0; i < 7; i++ ){
      context.beginPath();
      let point1 = project3DTo2D(points[i]);
      let point2 = project3DTo2D(points[i+1]);
      context.moveTo(point1[0], point1[1]);
      context.lineTo(point2[0], point2[1]);
      context.strokeStyle = "#FFFFFF";   
      context.lineWidth = 1;
      context.stroke();
    }
  }
  update() {
  }
}


