Anthony Tse

at4091

2020-03-30

Midterm Part A

4. LSTMs

   1. Equation 1 is credited as solving the vanishing gradient problem because of the first term, $ f_t \odot c_{t-1}$. Here, the previous cell state is passed forward in compution of the output.  It may still be difficult to capture long term dependencies if the magnitude of the sum of the two terms in $c_t$ is large as the derivative of $tanh(c_t)$ will be small.

5. Optimization

   1. $\theta \leftarrow  \theta - \eta * \frac{\partial L(\bold{\hat Y}_{\theta}(\bold{X)},\bold y)}{\partial \theta}$
   2. $\theta \leftarrow \theta - \frac{\eta}{M}\sum_{i=0}^M \frac{\partial \ell ({\hat y}_{\theta}({x_i)}, y_i)}{\partial \theta} $
   3. Faster optimization as you do not need to iterate over the entire data set for a single step down gradient.
   4. Batch sizes K or smaller will be good. Smaller batch sizes prevent optimization to a local bad minima. If the data is well shuffled, each batch should have not more than one example for each class, so that the sgd step is less biased towards a single class and converges more quickly. 
   5. SGD will be much noisier that GD, as the fewer number of samples per step means that the true gradient is only approximated. This noise results in annealing, in which the noise prevents convergence to suboptimal local minima. With SGD, steps may be made toward local optima because of the noise within individual samples. 
   6. At the end of training,  SGD will result in convergence to a global minimum. For nonconvex optimizations with local optima, SGD may be better than standard GD as SGD is less likely to get stuck in local minima.
   7. $B_t$ is called the heavy ball because large differences between $\bold w_t$ and $\bold w_{t-1}$ will result in larger changes to $\bold w_{t+1}$. This term promotes "movement" of the weights in the same direction as the previous step, and is similar to actual momentum in physics. Proper values of $B_t$ should be between 0 and 1.
   8. RMS Prop and Adam
      1. RMS Prop
         1. $\bold v$ : An expontial moving average of the weights. $ \bold v $ is a vector whose size corresponds to the number of weights. 
         2. $\alpha$ : Hyperparameter of the expontial moving average. Smaller alpha down weights previous values. Scalar value.
      2. Adam 
         1. $ \bold v $ and $ \alpha $ are the same as they are in RMS Prop 
         2. $ \bold m $  : momentum term. Is a vector whose size corresponds to the number of weights.
         3. $ \beta $ : Hyperparameter for computation of momentum.
      3. Memory Allocation. For each weight, Adam requires two additional values for momentum and exp. moving average, where as RMS Prop requires storing one for exponential moving average.
      4. Adam is known for better generalization.
   9. If the conditional statement is true, then it means that the validation loss of the current epoch is larger that the validation loss of the most recent 'NONMONO" number of epochs, that is, the validation loss is not decreasing monotonically. In this case, we reduce the step size by a factor LR_DECAY. We would want to do this because it is possible that our step size is too large, which causes us to "over shoot" the function minima. Decreasing the step size as validation loss fails to improve allows us to descend toward the minima.

6. Energy Based Models

   1. For a conditional EBM, we must have a function $F( \bold x , \bold y)$ that gives low values for compatible values of $\bold x$ and $\bold y$. Because function F is an implicit function, we can iterate over possible values for $ \bold y $ so that $F( \bold x , \bold y)$ results in the lowest value.

       $ \hat y = argmin_y F( \bold x , \bold y)  $

      

   2. $ P(y|x) = \frac{e^{- \beta F(x,y)}}{\int_{y'} e^{- \beta F(x,y')}}$

      

   3. LV EBM Free Energy

      1. Deterministic

         $F(x, y) = min_z E(x, y, z)$ 

      2. Probablistic

         $F_{\beta}(x, y) = -\frac{1}{\beta}log\int_z e^{-\beta E(x, y, w)}$

         

   4. $NNL(W) = \sum_i(E(y_i, x_i, W) +\frac{1}{\beta}log\int_{y'} e^{-\beta E(y', x_i, W)})$

      

   5. Latent Variable EBMs such as K-means use a loss function that is neither probablistic or based on maximum likelihood. K-means has an energy function of $F(Y) = min_z\sum_i||Y-W_iZ_i||$ . 

      

   6. Architectural methods work by using regularization to limit the volume of low energy regions in F(x,y). Examples of architectural methods are PCA, K-Means, and Variational Autoencoders.