export default function displayHelp() {
  console.log(`
Usage: mypkg [options]

Options:
  -D, --dev         Include only devDependencies
  -N, --no-dev      Exclude devDependencies
  -d, --desc        Show package description
  -l, --link        Show package homepage and repository
  -a, --author      Show package author
  -p, --publish     Show package last publish date
  -h, --help        Display this help message

Examples:
  mypkg
  mypkg --dev
  mypkg --no-dev
  mypkg -desc
  mypkg -link -author
  
  mypkg -D
  mypkg -N
  mypkg -d
  mypkg -l -a
  `);
}
