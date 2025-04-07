(define nums(list 10 20 30 40))
(define printList(lambda (i size) 
                   (if (>= i size) 
                     (print "All Done") 
                     ((print (at nums i)) (printList (+ i 1) size)))))

(printList 0 4)
