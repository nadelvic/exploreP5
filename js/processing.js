
const canvasWidth = 900;
const canvasHeight = 500;

let canvasRef;
function setup(){
    var cnv = createCanvas(canvasWidth,canvasHeight);
    cnv.parent('canvas');
    colorMode(RGB,255,255,255);
    background(255);
    noLoop(); 


}
function draw(){
    //ellipse(x,y,width,height);
    //ellipse(30,30,50,50);
    noStroke();
    const rasterParameter = {
        fillPourcentage: .5,
        tileSize: 4,
        shiftAmplitude: .2,
        lineDisplay: false,
        gradientDisplay: true,
        gradientAngle: 90
    }
    generateRaster(rasterParameter);
    //export in csv

}

function mouseReleased(){
    //save();
  }


/**
 * This displays a field with unregulars dots spreaded over a surface.
 * 
 * @param {*} RasterParameter Size of the dot compare to its available space, its tile.
 */
function generateRaster(parameters){
    const circleDiameter = parameters.tileSize * parameters.fillPourcentage;
    const tileWidthCount = canvasWidth / parameters.tileSize;
    const tileHeightCount = canvasHeight / parameters.tileSize;

    let angle = parameters.gradientAngle; // this will be a parameter

    console.log ( circleDiameter + '\n'+tileWidthCount+'\n'+tileHeightCount);

    // Computing  Values used for gradient
    const centerPosition = {
        x: canvasWidth / 2,
        y: canvasHeight / 2
    }
    const cornerCoordinates = {
        topLeft : { x: 0, y:0 },
        topRight : { x: canvasWidth, y: 0 },
        bottomLeft : { x: 0, y: canvasHeight },
        bottomRight : {x: canvasWidth, y: canvasHeight}
        }

    //fill(200,10,10);
    

    angle = angle % 360;
    let cornerMin = cornerCoordinates.bottomLeft;
    let cornerMax = cornerCoordinates.topRight;
    if (angle >= 0 && angle < 90){
        // case < PI / 2
        // initial value are ok. Nothing to change
        console.log("quarter 1");

    } else if ( angle >= 90 && angle < 180 ){
        // case PI/2 - PI
        cornerMin = cornerCoordinates.bottomRight;
        cornerMax = cornerCoordinates.topLeft;
        console.log(cornerMax);
    }else if ( angle >= 180 && angle < 270) {
        // case PI - 3PI/2
        cornerMin = cornerCoordinates.topRight;
        cornerMax = cornerCoordinates.bottomLeft;
    } else {
        // case 3PI/2 - 2PI
        cornerMin = cornerCoordinates.topLeft;
        cornerMax = cornerCoordinates.bottomRight;
    }

    displayDot(cornerMin.x,cornerMin.y,0,254,0);
    //displayDot(0,0,0,255,0);
    displayDot(cornerMax.x,cornerMax.y,255,0,0);
    //compute PMin and PMax the two extreme point on the axis of the gradient corresponding respectively to opacity 0 and 1.
    const PMax = getProjectionCoord(angle,centerPosition.x,centerPosition.y,cornerMin.x,cornerMin.y,0);
    const PMin = getProjectionCoord(angle,centerPosition.x,centerPosition.y,cornerMax.x,cornerMax.y,0);
    // The length between PMin and PMax and the axis of the gradient.
    const rangeLength = PMax - PMin;
    // Let's package all the value necessary for computing the projectionValue (and thus opacity) of each shape.
    const gradientParameter = {
        angle:angle,
        centerPosition : centerPosition,
        PMin : PMin,
        PMax : PMax,
        rangeLength : rangeLength
    };
    console.log(gradientParameter);

    // Let's loop around all tiles.
    let nProcessed = 0
    for(let gridY = 0;gridY<tileHeightCount;gridY++){
        //stroke(140);
        if(parameters.displayLine) line(0,gridY*parameters.tileSize,width,gridY*parameters.tileSize);
        for(let gridX=0;gridX<tileWidthCount;gridX++){
            if(parameters.displayLine && gridY == 0){
                line(gridX*parameters.tileSize,0,gridX*parameters.tileSize,height);
            }
            let shiftX = generateShift(parameters.shiftAmplitude,parameters.tileSize);
            let shiftY = generateShift(parameters.shiftAmplitude,parameters.tileSize);
            //console.log(shiftX);


            let centerTileX = canvasWidth / tileWidthCount * gridX + parameters.tileSize/2;
            let centerTileY = canvasHeight / tileHeightCount * gridY + parameters.tileSize/2
        
            let posX =  centerTileX + shiftX ;
            let posY =  centerTileY + shiftY;
            

            fill(10);
            const displayProbability = getProbability(parameters.gradientDisplay ? 'GRADIENT': 'LINEAR',centerTileX,centerTileY,gradientParameter,nProcessed)
            nProcessed++;
            generateShape('CIRCLE',circleDiameter,posX,posY,displayProbability);
        }
    }
    console.log(nProcessed);

}

/**
 * This function return a display probability between 0 and 1 given the gradient function and the angle provided.
 * Coordinates of the shape position are provided as well
 * @param {*} angle 
 * @param {*} GradientFunction 
 * @param {*} xCoord 
 * @param {*} yCoord 
 */
function getProbability(GradientFunction,xCoord,yCoord,gradientParameter,i){
    if(GradientFunction == 'GRADIENT'){
        const PCoord = getProjectionCoord(gradientParameter.angle,gradientParameter.centerPosition.x,gradientParameter.centerPosition.y,xCoord,yCoord,i);
        const res = {
            xCoord: xCoord,
            yCoord: yCoord,
            pCoord:PCoord
        }
        //if(i % 100 == 0) console.log(res);
        return getPositionRelativeValue(gradientParameter.rangeLength,gradientParameter.PMin,PCoord)
    }
    else {
        return 1;
    }
}


/**
 * 
 * @param {*} aX 
 * @param {*} aY 
 * @param {*} bX 
 * @param {*} bY 
 */
function getDistanceBetweenPoint(aX,aY,bX,bY){
    let dX = bX - aX;
    let dY = bY - aY;
    return Math.sqrt(dX*dX + dY * dY);
}

/**
 * Compute the position of a projected point onto the axis with the angle theta. The Center refers to the point of reference at 0,0 on the axis.
 * The axis revolves around this center point with theta.
 * @param {*} theta 
 * @param {*} centerX 
 * @param {*} centerY 
 * @param {*} pX 
 * @param {*} pY 
 */
function getProjectionCoord(theta,centerX,centerY,pX,pY,i){
    // Distance to the center
    const D = getDistanceBetweenPoint(centerX,centerY,pX,pY);
    // Let's compute the angle between  the point and the original grid.
    let alpha = 0;
    let x = pX - centerX;
    let y = pY - centerY;
    if(x >= 0){
        alpha = Math.atan(y/x) * 180 / Math.PI;   
    } else {
        alpha = Math.atan(y/x) * 180 / Math.PI + 180 ;
    }
    //if(i%10 == 0) console.log(alpha);

    // beta is the angle between the axis point center and the axis with the angle theta.
    let beta = theta - alpha;
    let projCoordinate = Math.cos(radians(beta)) * D;
    return projCoordinate;
}

/**
 * This function compute the position between 0 and 1 within the min and the max of the axis. 
 * @param {*} RangeLength 
 * @param {*} PMinCoord 
 * @param {*} PCoord 
 */
function getPositionRelativeValue(RangeLength,PMinCoord,PCoord){
    return (PCoord - PMinCoord) / RangeLength;
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
            fill(10);
            //fill(round(255 * displayProbability))
            ellipse(posX,posY,size,size);
            
        }
    }
     
}


function displayDot(posX,posY,r,g,b){
    fill(r,g,b);
    const d = 10;
    ellipse(posX,posY,d,d);
}





