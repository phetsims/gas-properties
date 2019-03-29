TODO implementation overview

Collision detection:
* reference: https://en.wikipedia.org/wiki/Collision_detection
* detected after collision occurs (a posteriori, discrete)
* pruning via spatial partitioning and bounding boxes

Collision response:
* reference: https://en.wikipedia.org/wiki/Collision_response
* impulse-based contact model

To avoid working with very small numbers and encountering potential 
float-point errors, we are not using SI units in the model.  For example,
KE is typically in J, which is _kg * m<sup>2</sup> / s<sup>2</sup>_.
We're using _AMU * nm<sup>2</sup> / ps<sup>2</sup>_.  See [model.md](https://github.com/phetsims/gas-properties/blob/master/doc/model.md) 
for the full list of units used in the model.