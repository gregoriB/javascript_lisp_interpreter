(define square(lambda (x) (* x x)))

(define x 5)

(print "squared: " (square x))

(if (> 1 0) (print "1 > 0 evalution is:" true) (print "1 < 0 evaluation is:" false))
(if (< 1 0) (print "1 > 0 evalution is:" true) (print "1 < 0 evaluation is:" false))

(define ternary1 (if (== x 5) ("yes") ("no")))
(define ternary2 (if (!= x 5) ("yes") ("no")))

(print "ternary 1" ternary1)
(print "ternary 2" ternary2)

(define str "test string")
(print str)

(redefine str "that's all folks!")
(print str)
