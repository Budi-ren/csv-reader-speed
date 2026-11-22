const _COMMA = 'comma';
const _LINE_BREAK = 'line break';
const _END = 'end';

export function run(input) {
  const text = String(input.text);
  const header = input.header === true;
  const errors = [];
  const rows = [];
  let columns = null;
  let width = -1;

  let pos = 0;
  let line = 1;
  if (text.length > 0 && text.charCodeAt(0) === 0xFEFF) pos = 1;

  let recordLine = 1;
  let recordRow = null;

  function error(code) {
    errors.push({ code, line: recordLine, row: recordRow });
  }

  function at(i) {
    return i >= 0 && i < text.length ? text[i] : '';
  }

  function readUnquoted(value) {
    let added = 0;
    while (pos < text.length) {
      const c = text.charAt(pos);
      if (c === ',') {
        pos += 1;
        return { value, ended: _COMMA, added };
      }
      if (c === '\n') {
        pos += 1;
        line += 1;
        return { value, ended: _LINE_BREAK, added };
      }
      if (c === '\r') {
        if (at(pos + 1) === '\n') {
          pos += 2;
          line += 1;
          return { value, ended: _LINE_BREAK, added };
        }
        error('stray_cr');
        pos += 1;
        continue;
      }
      value += c;
      added += 1;
      pos += 1;
    }
    return { value, ended: _END, added };
  }

  function readQuoted() {
    const openLine = line;
    const quoteStart = pos;
    let value = '';
    pos += 1;
    let closed = false;
    while (pos < text.length) {
      const c = text.charAt(pos);
      if (c === '"') {
        if (at(pos + 1) === '"') {
          value += '"';
          pos += 2;
          continue;
        }
        pos += 1;
        closed = true;
        break;
      }
      if (c === '\r') {
        value += '\n';
        line += 1;
        if (at(pos + 1) === '\n') {
          pos += 2;
        } else {
          pos += 1;
        }
        continue;
      }
      if (c === '\n') {
        line += 1;
      }
      value += c;
      pos += 1;
    }
    if (!closed) {
      pos = quoteStart + 1;
      line = openLine;
      error('unterminated_quote');
      return readUnquoted('"');
    }
    if (pos >= text.length) return { value, ended: _END };
    const c = text.charAt(pos);
    if (c === ',') {
      pos += 1;
      return { value, ended: _COMMA };
    }
    if (c === '\n') {
      pos += 1;
      line += 1;
      return { value, ended: _LINE_BREAK };
    }
    if (c === '\r' && at(pos + 1) === '\n') {
      pos += 2;
      line += 1;
      return { value, ended: _LINE_BREAK };
    }
    const junk = readUnquoted(value);
    if (junk.added > 0) error('quote_junk');
    return junk;
  }

  while (true) {
    while (pos < text.length) {
      const c = text.charAt(pos);
      if (c === '\n') {
        pos += 1;
        line += 1;
      } else if (c === '\r' && at(pos + 1) === '\n') {
        pos += 2;
        line += 1;
      } else {
        break;
      }
    }
    if (pos >= text.length) break;

    recordLine = line;
    recordRow = header && columns === null ? null : rows.length;
    const fields = [];
    let field;
    let quoted;
    do {
      quoted = text.charAt(pos) === '"';
      field = quoted ? readQuoted() : readUnquoted('');
      fields.push(field.value);
    } while (field.ended === _COMMA);

    if (fields.length === 1 && fields[0] === '' && !quoted) continue;

    if (width < 0) width = fields.length;
    if (header && columns === null) {
      columns = fields;
      continue;
    }
    if (fields.length < width) {
      errors.push({ code: 'short_row', line: recordLine, row: recordRow, fields: fields.length });
      while (fields.length < width) fields.push('');
    } else if (fields.length > width) {
      errors.push({ code: 'long_row', line: recordLine, row: recordRow, extra: fields.splice(width) });
    }
    rows.push(fields);
  }

  return {
    columns: header ? (columns ?? []) : null,
    rows,
    errors
  };
}
