export function startLoadingAnimation() {
  const frames = [".  ", ".. ", "..."];
  let i = 0;

  return setInterval(() => {
    process.stdout.write(`\rLoading${frames[i]}`);
    i = (i + 1) % frames.length;
  }, 300);
}

export function stopLoadingAnimation(intervalId) {
  clearInterval(intervalId);
  process.stdout.write("\r\x1b[K");
}
