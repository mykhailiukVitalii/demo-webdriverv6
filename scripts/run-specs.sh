# #!/bin/bash

# TEST_URL=${TEST_URL:-"http://clojure:3020"}

# main() {
#     # Usage show when are no params provided
#     [ $# -eq 0 ] && usage && graceful_exit

#     # Parsing parameters section
#     while getopts ":ht:" arg; do
#         case "$arg" in
#         t)  # Package.json script task to run the tests specs
#             TASK_TO_RUN=$OPTARG
            
#             if [ -z "$TASK_TO_RUN" ]; then
#                clean_up "Task name can not be empty!"
#             fi
#         ;;
#         h)  # display help.
#             usage
#             graceful_exit
#         ;;

#         ?)
#             usage
#             clean_up "Incorrect argument ${OPTARG}"
#         ;;
#         esac
#     done
#     # End parsing parameters section

#     # Body
#     node_modules/.bin/wait-on -v "$TEST_URL" && echo "$TASK_TO_RUN" | bash
# }

# clean_up() {
#     [ ! -z "$1" ] && echo "Error: ${1}" 1>&2
#     exit 1;
# }

# graceful_exit() {
#     exit 0;
# }

# usage() {
#     echo "Script usage:" && grep -e "\s.)\\s\s#" $0 | sed -r "s/(.)\)\s+#/-\1,/";
# }

# main "$@"