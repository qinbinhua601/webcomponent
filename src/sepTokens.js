export function sepTokens(tokens) {
  const result = [];
  const current = [];

  for(let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token.block) {
      current.push(token);
      continue;
    }
    if (token.level !== 0) {
      current.push(token);
      continue;
    }

    if (token.nesting === 0) {
      current.push(token);
      result.push(current.slice())
      current.length = 0;
      continue;
    }

    if (token.nesting === 1) {
      current.push(token);
      continue;
    }
    if (token.nesting === -1) {
      current.push(token);
      result.push(current.slice())
      current.length = 0;
      continue;
    }
  }
  return result;
}