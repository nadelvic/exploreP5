
const canvasWidth = 900;
const canvasHeight = 500;

let canvasRef;
function setup(){
    var cnv = createCanvas(canvasWidth,canvasHeight);
    cnv.parent('canvas');
    background(255);
    noLoop(); 


}
function draw(){
    //ellipse(x,y,width,height);
    //ellipse(30,30,50,50);
    generateParticuleTiling(.2,5,.4,false);
    //export in csv

}

function mouseReleased(){
    //save();
  }


/**
 * This displays a field with unregulars dots spreaded over a surface.
 * 
 * @param {*} fillPourcentage Size of the dot compare to its available space, its tile.
 * @param {*} tileSize Size of the tile that encompass one dot
 * @param {*} shiftAmplitude Pourcentage of the tile in wich a dot can shift
 * @param {*} displayLine boolean to control the display of the horizontal lines
 */
function generateParticuleTiling(
    fillPourcentage,
    tileSize,
    shiftAmplitude,
    displayLine){
    const circleDiameter = tileSize * fillPourcentage;
    const tileWidthCount = canvasWidth / tileSize;
    const tileHeightCount = canvasHeight / tileSize;
    console.log ( circleDiameter + '\n'+tileWidthCount+'\n'+tileHeightCount);

    for(let gridY = 0;gridY<tileHeightCount;gridY++){
        //stroke(140);
        if(displayLine) line(0,gridY*tileSize,width,gridY*tileSize);
        for(let gridX=0;gridX<tileWidthCount;gridX++){
            if(displayLine && gridY == 0){
                line(gridX*tileSize,0,gridX*tileSize,height);
            }
            let shiftX = generateShift(shiftAmplitude,tileSize);
            let shiftY = generateShift(shiftAmplitude,tileSize);
            //console.log(shiftX);
        
            let posX = canvasWidth / tileWidthCount * gridX + tileSize/2 + shiftX ;
            let posY = canvasHeight / tileHeightCount * gridY + tileSize/2 + shiftY;
            
            //stroke(230);
            fill(10);
            generateShape('CIRCLE',circleDiameter,posX,posY,getProbability(0,'UNIFORM',gridX,gridY));
        }
    }

}

/**
 * This function returns a random value within a given range of position.
 * @param {*} amplitude Pourcentage of the tile size where the dot can shift.
 * @param {*} boundarySize Range of space on which the random function can spread.
 */
function generateShift(amplitude,boundarySize){

    return random(-1,1) * amplitude * boundarySize ;
}

/**
 * This function return a display probability between 0 and 1 given the gradient function and the angle provided.
 * Coordinates of the shape position are provided as well
 * @param {*} angle 
 * @param {*} GradientFunction 
 * @param {*} xCoord 
 * @param {*} yCoord 
 */
function getProbability(angle,GradientFunction,xCoord,yCoord){
    if(GradientFunction == 'LINEAR'){

    }
    else {
        return 1;
    }
}

/**
 * @param {*} shapeType String defining the type of shape to generate (SQUARE,CIRCLE default)
 * @param {*} size Size of the shape (diamater if circle, side size for a square) -> Regular shape only
 * @param {*} posX X position of the shape
 * @param {*} posY Y position of the shape
 * @param {*} displayProbability Probability of display of the shape -> usefull for gradient
 */
function generateShape(shapeType,size,posX,posY,displayProbability){
    if(random(0,1) <= displayProbability){
        if(shapeType == 'SQUARE'){
            square(posX,posY,size);
        }
        else{
            //ellipse
            ellipse(posX,posY,size,size);
            
        }
    }
     
}



