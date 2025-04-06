(define str "This is a test string")
(print str)

(print "-----------------")

(define square(lambda (x) (* x x)))
(define x 5)
(print "squared: " (square x))

(print "-----------------")

(if (> 1 0) (print "1 > 0 evalution is:" true) (print "1 > 0 evaluation is:" false))
(if (< 1 0) (print "1 < 0 evalution is:" true) (print "1 < 0 evaluation is:" false))
(if (<= 1 0) (print "1 <= 0 evalution is:" true) (print "1 <= 0 evaluation is:" false))
(if (>= 1 0) (print "1 >= 0 evalution is:" true) (print "1 >= 0 evaluation is:" false))
(if (!= 1 0) (print "1 != 0 evalution is:" true) (print "1 != 0 evaluation is:" false))
(if (== 1 0) (print "1 == 0 evalution is:" true) (print "1 == 0 evaluation is:" false))

(print "-----------------")

(define ternary1 (if (== x 5) ("yes") ("no")))
(define ternary2 (if (!= x 5) ("yes") ("no")))
(print "ternary 1 says" ternary1)
(print "ternary 2 says" ternary2)

(print "-----------------")

(redefine str "that's all folks!")
(print str)
