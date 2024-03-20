#!/bin/bash
# Initialize variables
MODULE_ENTITY_NAME=""
PERMISSION_NAME=""
PT_ENTITY_NAME=""

preventKebabCaseInput() {
    local input="$1"
    if [[ "$input" == *-* ]]; then
        echo "$input" | sed -E 's/(^|-)([a-z])/\U\2/g; s/-([a-z])/\U\1/g;'
    else
        echo "$input"
    fi
}

lowercase_first_letter() {
    local string="$1"
    echo "${string,}"
}

# Parse command line arguments
for arg in "$@"; do
    case $arg in
        --name=*)
        MODULE_ENTITY_NAME="${arg#*=}"
        MODULE_ENTITY_NAME="$(preventKebabCaseInput "$MODULE_ENTITY_NAME")"
        MODULE_ENTITY_NAME="$(lowercase_first_letter "$MODULE_ENTITY_NAME")"
        shift
        ;;
        --permission-name=*)
        PERMISSION_NAME="${arg#*=}"
        shift
        ;;
        --pt-name=*)
        PT_ENTITY_NAME="${arg#*=}"
        shift
        ;;
        *)
        echo "Invalid argument: $arg"
        exit 1
        ;;
    esac
done

# Check if module/entity name is provided
if [ -z "$MODULE_ENTITY_NAME" ] || [ -z "$PT_ENTITY_NAME" ]; then
  echo "Usage: ./create_module.sh --name=<module_entity_name> --pt-name=<portuguese_name> --permission-name=<permission_name>"
  exit 1
fi

# Function to convert a word to singular
singularize() {
    local word="$1"
    local singular=""
    case "$word" in
        *ies) singular="${word%ies}y" ;;
        *ses) singular="${word%es}" ;;
        *xes) singular="${word%xes}" ;;
        *oes) singular="${word%oes}" ;;
        *sses) singular="$word" ;; # for cases like "classes"
        *) singular="${word%s}" ;;
    esac
    echo "$singular"
}

# Convert the module/entity name to singular
MODULE_ENTITY_NAME=$(singularize "$MODULE_ENTITY_NAME")

# Function to pluralize a word
pluralize() {
    local word="$1"
    local last_char="${word: -1}" # Get the last character of the word
    case "$last_char" in
        "y")
        echo "${word%y}ies" ;;
        *)
        echo "${word}s" ;;
    esac
}

to_snake_case() {
    echo "$1" | sed -r 's/([A-Z])/_\1/g' | sed -r 's/^_//g' | tr '[:upper:]' '[:lower:]'
}

to-kebab_case() {
    echo "$1" | sed -r 's/([A-Z])/-\1/g' | sed -r 's/^-*//g' | tr '[:upper:]' '[:lower:]'
}

ENTITY_NAME_CAPITALIZED=$(echo "$MODULE_ENTITY_NAME" | sed 's/.*/\u&/')
ENTITIES_NAME_PLURAL=$(pluralize "$MODULE_ENTITY_NAME")
ENTITIES_NAME_PLURAL_CAPITALIZED=$(echo "$ENTITIES_NAME_PLURAL" | sed 's/.*/\u&/')
ENTITY_NAME_KEBAB=$(to-kebab_case "$MODULE_ENTITY_NAME")
ENTITY_NAME_KEBAB_PLURAL=$(to-kebab_case "$ENTITIES_NAME_PLURAL")
ENTITY_PT_CAPITALIZED=$(echo "$PT_ENTITY_NAME" | sed 's/.*/\u&/')


# If permission name is not provided, set it to the lowercase version of module/entity name
if [ -z "$PERMISSION_NAME" ]; then
  PERMISSION_NAME="$ENTITIES_NAME_PLURAL"
fi

# Copy the module_template directory
cp -r ./src/template/module src/modules/"$ENTITY_NAME_KEBAB_PLURAL"

# Iterate over all files in directory and rename if necessary
find "src/modules/$ENTITY_NAME_KEBAB_PLURAL" -type f -print0 | while IFS= read -r -d '' file; do
    if [[ $file == *'$entity-kebab$'* ]]; then
        echo "Updating file: $file"
        new_name="${file//\$entity-kebab\$/"$(to-kebab_case "$MODULE_ENTITY_NAME")"}"
        echo "New name: $new_name"  # Debugging line
        mv "$file" "$new_name"
    fi

    if [[ $file == *'$entities-kebab$'* ]]; then
        echo "Updating file: $file"
        new_name="${file//\$entities-kebab\$/"$(to-kebab_case "$ENTITIES_NAME_PLURAL")"}"
        echo "New name: $new_name"  # Debugging line
        mv "$file" "$new_name"
    fi
  
    if [[ $file == *'$Entity$'* || $file == *'$entity$'* || $file == *'$Entities$'* || $file == *'$entities$'* ]]; then
        echo "Renaming file: $file"
        new_name="${file//\$Entity\$/"$ENTITY_NAME_CAPITALIZED"}"
        new_name="${new_name//\$entity\$/"$MODULE_ENTITY_NAME"}"
        new_name="${new_name//\$Entities\$/"$ENTITIES_NAME_PLURAL_CAPITALIZED"}"
        new_name="${new_name//\$entities\$/"$ENTITY_NAME_KEBAB_PLURAL"}"
        mv "$file" "$new_name"
    fi
done

# define method to update files replacing "ENTITY" with the actual module/entity name
update_files() {
    local value_to_change="$1"
    local replacement_value="$2"
    local files=$(grep -rl "$value_to_change" src/modules/"$ENTITY_NAME_KEBAB_PLURAL")

    for file in $files; do
        echo "Replacing in file: $file"
        sed -i "s/$value_to_change/$replacement_value/g" "$file"
    done
}

# Define the strings to be replaced and call the function
update_files '\$Entity\$' "$ENTITY_NAME_CAPITALIZED"
update_files '\$entity\$' "$MODULE_ENTITY_NAME"
update_files '\$Entities\$' "$ENTITIES_NAME_PLURAL_CAPITALIZED"
update_files '\$entities\$' "$ENTITIES_NAME_PLURAL"
update_files '\$entity_pt\$' "$PT_ENTITY_NAME"
update_files '\$Entity_pt\$' "$ENTITY_PT_CAPITALIZED"
update_files '\$entity_snake\$' "$(to_snake_case "$MODULE_ENTITY_NAME")"
update_files '\$entities_snake\$' "$(to_snake_case "$ENTITIES_NAME_PLURAL")"
update_files '\$entity-kebab\$' "$ENTITY_NAME_KEBAB"
update_files '\$entities-kebab\$' "$ENTITY_NAME_KEBAB_PLURAL"
update_files "'\$permission_name\$' as RolePermissionName" "'$PERMISSION_NAME'"

# Define method to uncomment the Entity decorators
uncomment_entity() {
    local value_to_change="$1"
    local replacement_value="$2"
    local entity_files=$(find "src/modules/$ENTITY_NAME_KEBAB_PLURAL/entities" -type f)
    sed -i "s/$value_to_change/$replacement_value/g" $entity_files
}

ENTITIES_NAME_SNAKECASE=$(to_snake_case "$MODULE_ENTITY_NAME")

# Update entity database table definition file
uncomment_entity "\/\/@Entity()" "@Entity('$ENTITIES_NAME_SNAKECASE')" 
uncomment_entity "\/\/Entity" "Entity"