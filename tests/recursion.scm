(define loop(lambda (i limit) 
              (if (> i limit) 
                (print "loop done")
                ((print i) 
                 (loop (+i 1) limit)))))

(loop 1 10)
