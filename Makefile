
MIN		= 1
MAX		= 500

TEST_DIR	= ../
MAKEFILE	= ${addsuffix ${TEST_DIR}, Makefile}

all: genfile visualise
	make -C ${MAKEFILE} all
genfile:
	@seq ${MIN} ${MAX} | shuf -o rand.txt
	@${TEST_DIR}/push_swap `cat rand.txt` > instr.txt
visualise:
	@echo "Open up Chrome and type http://localhost:4269 into the address bar, if the browser didn't pop up."
	@if [ ! -z "$(shell grep Microsoft /proc/version)" ]; then\
		cmd.exe /C start "http://localhost:4269";\
	elif [ ! -z "$(shell grep darwin /proc/version)" ]; then\
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
