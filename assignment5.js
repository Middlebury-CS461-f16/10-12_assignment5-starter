let vertexShader = `
attribute vec4 a_Position;
attribute vec4 a_Color;

uniform mat4 u_View;
uniform mat4 u_Projection;
uniform mat4 u_Transform;

varying vec4 v_Color;

void main(){
  v_Color = a_Color;
  gl_Position = u_Projection * u_View * u_Transform * a_Position;
}`;

var fragmentShader = `
precision mediump float;
varying vec4 v_Color;
void main(){
  gl_FragColor = v_Color;
}`;

/*
  This creates the scenegraph. Calling this returns the root node.

  Note that the scenegraph has a stack and a current transformation.

  There are two kinds of nodes, shape and transformation.

  The transformation nodes take in a transformation matrix as data. They also have two functions:
    add(type data) - creates a new node of type "type", adds it to its child list and returns it.
    apply() - applies its associated transformation by multiplying it with the current matrix. Calls apply on all children

  The shape node takes in a function to be called to draw the associated shape. It has one function:
    apply() - calls its associated drawing method to draw the shape with the current transformation.

*/
var createScenegraph = function(gl, program){
  let stack = [];
  let currentMatrix = mat4.create();
  let u_Transform = gl.getUniformLocation(program, 'u_Transform');

  let createTransformationNode = function(matrix){
    let children = [];
    return {
      add: function(type, data){
        let node;
        if (type === "transformation"){
          node = createTransformationNode(data);
        }else if (type === "shape"){
          node = createShapeNode(data);
        }
        children.push(node);
        node.parent = this;
        return node;
      },
      apply: () =>{
        /* YOUR CODE HERE */
        /* This needs to multiply in the node's matrix with the current transform and then iterate over all of the children, calling their apply() functions.

        Make use of the stack to preserve the state of the current matrix.
        */

      }

    };
  };

  let createShapeNode = function(shapeFunc){
    return {
      apply: () =>{
        shapeFunc();
      }

    };
  };


  let root = createTransformationNode(mat4.create());

  return root;
};








window.onload = function(){
  let canvas = document.getElementById('canvas');
  let gl;
  // catch the error from creating the context since this has nothing to do with the code
  try{
    gl = middUtils.initializeGL(canvas);
  } catch (e){
    alert('Could not create WebGL context');
    return;
  }

  // don't catch this error since any problem here is a programmer error
  let program = middUtils.initializeProgram(gl, vertexShader, fragmentShader);

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0,0,0,1);


  /*
  The conventional key handler detects when a key is held down for repeat actions, but it has a pause before it detects the repeat and it is flaky with two keys held down simultaneously. This avoids this by maintaining a mapping of the keys that are currently pressed.
  */
  var keyMap = {};

  window.onkeydown = function(e){
      keyMap[e.which] = true;
  }

  window.onkeyup = function(e){
       keyMap[e.which] = false;
  }

  // the render function
  let render = function(){



    // check which keys that we care about are down
    if  (keyMap['W'.charCodeAt(0)]){
        console.log('forward');
    }else if (keyMap['S'.charCodeAt(0)]){
        console.log('backward');
    }

    if  (keyMap['A'.charCodeAt(0)]){
        console.log('turn left');
    }else if (keyMap['D'.charCodeAt(0)]){
        console.log('turn right');
    }

    // clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // DRAW STUFF HERE

    requestAnimationFrame(render);
  };

  render();

};
