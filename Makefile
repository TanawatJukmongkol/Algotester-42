
START		= 1
END			= 100

TEST_DIR	= ../
MAKEFILE	= ${addsuffix ${TEST_DIR}, Makefile}

all: build visualise
	make -C ${MAKEFILE} all
genfile:
	@ruby -e "puts (${START}..${END}).to_a.shuffle.join(' ')" > rand.txt
	@./push_swap `cat rand.txt` > instr.txt
visualise:
	@echo "Open up Chrome and type http://localhost:4269 into the address bar, if the browser didn't pop up."
	if [[ "$(shell grep Microsoft /proc/version)" ]]; then\
		cmd.exe /C start "http://localhost:4269";\
	elif [[ "$OSTYPE" == "darwin"* ]]; then\
		open -a "Google Chrome" "http://localhost:4269";\
	else\
		xdg-open "http://localhost:4269";\
	fi
	python3 -m http.server 4269
clean:
	make -C ${MAKEFILE} clean
fclean:
	make -C ${MAKEFILE} fclean
	rm -f rand.txt
	rm -f instr.txt
re:
	make -C ${MAKEFILE} re

.PHONY:		all genfile visualise clean fclean re
