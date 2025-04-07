(define iterate(lambda (i limit) 
              (if (> i limit) 
                (print "iterate done")
                ((print i) 
                 (iterate (+i 1) limit)))))

(iterate 1 10)
