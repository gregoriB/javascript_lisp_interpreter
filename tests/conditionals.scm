(if (> 1 0) (print "1 > 0 evalution is:" true) (print "1 > 0 evaluation is:" false))
(if (< 1 0) (print "1 < 0 evalution is:" true) (print "1 < 0 evaluation is:" false))
(if (<= 1 0) (print "1 <= 0 evalution is:" true) (print "1 <= 0 evaluation is:" false))
(if (>= 1 0) (print "1 >= 0 evalution is:" true) (print "1 >= 0 evaluation is:" false))
(if (!= 1 0) (print "1 != 0 evalution is:" true) (print "1 != 0 evaluation is:" false))
(if (== 1 0) (print "1 == 0 evalution is:" true) (print "1 == 0 evaluation is:" false))

(if  (> 1 0) () (fail "branch: > 1 0"))
(if  (< 1 0) (fail "branch: < 1 0") ())
(if (<= 1 0) (fail "branch: <= 1 0") ())
(if (>= 1 0) () (fail "branch: >= 1 0"))
(if (!= 1 0) () (fail "branch: != 1 0"))
(if (== 1 0) (fail "branch: == 1 0") ())

(define x 5)

(define ternary1 (if (== x 5) ("yes") ("no")))
(define ternary2 (if (!= x 5) ("yes") ("no")))

(assert ternary1 "yes")
(assert ternary2 "no")

(print "ternary 1 says" ternary1)
(print "ternary 2 says" ternary2)
