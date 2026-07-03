# VERSION_MANIFEST.md

**Generated**: 2026-07-03T13:38:17.229Z
**Manifest Version**: 1.0
**Location**: docs\VERSION_MANIFEST.md

---

## Summary

- **Agents**: 0
- **Skills**: 17
- **Scripts**: 263
- **Commands**: 6

---

## Agents

| Name | File | Tier | Model | Last Modified |
|------|------|------|-------|---------------|

---

## Skills

| Name | Version | Location | Platform | Triggers | Owner |
|------|---------|----------|----------|----------|-------|
| agent-lifecycle-manager | 1.0.0 | skills/agent-lifecycle-manager/SKILL.md | workspace | N/A | pm |
| agent-lifecycle-manager | 1.0.0 | .claude/skills/agent-lifecycle-manager/SKILL.md | both | N/A | pm |
| api-documentation | 1.0.0 | .claude/skills/api-documentation/SKILL.md | claude | N/A | N/A |
| documentation-writing | 1.0.0 | .claude/skills/documentation-writing/SKILL.md | claude | N/A | N/A |
| finishing-a-development-branch | 1.0.0 | .claude/skills/finishing-a-development-branch/SKILL.md | both | N/A | N/A |
| legalize-kr-sync | 1.0.0 | skills/legalize-kr-sync/SKILL.md | workspace | N/A | safety-workflow-manager |
| meeting-facilitation | 1.4.0 | skills/meeting-facilitation/SKILL.md | workspace | N/A | pm |
| meeting-facilitation | 1.3.1 | .claude/skills/meeting-facilitation/SKILL.md | both | N/A | pm |
| platform-command-lifecycle-manager | 1.0.0 | .claude/skills/platform-command-lifecycle-manager/SKILL.md | both | N/A | pm |
| platform-skill-lifecycle-manager | 1.0.0 | .claude/skills/platform-skill-lifecycle-manager/SKILL.md | both | N/A | pm |
| project-review | 1.0.0 | skills/project-review/SKILL.md | workspace | N/A | pm |
| research-analysis | 1.0.0 | .claude/skills/research-analysis/SKILL.md | claude | N/A | N/A |
| script-lifecycle-manager | 1.2.0 | skills/script-lifecycle-manager/SKILL.md | workspace | N/A | pm |
| simulate-project-creation | 1.0.0 | .claude/skills/simulate-project-creation/SKILL.md | both | N/A | scaffolding-expert |
| skill-lifecycle-manager | 1.2.0 | skills/skill-lifecycle-manager/SKILL.md | workspace | N/A | pm |
| team-builder | 1.1.0 | skills/team-builder/SKILL.md | workspace | N/A | pm |
| translate | 1.0.0 | skills/translate/SKILL.md | workspace | N/A | pm |

---

## Scripts

| Name | Version | Location | Dependencies |
|------|---------|----------|--------------|
| abortcontroller.d.ts | N/A | scripts/node_modules/@types/node/web-globals/abortcontroller.d.ts | N/A |
| agent-create.ts | N/A | scripts/agent-create.ts | N/A |
| agent-delete.ts | N/A | scripts/agent-delete.ts | N/A |
| agent-lifecycle-audit.ts | N/A | scripts/agent-lifecycle-audit.ts | N/A |
| agent-list.ts | N/A | scripts/agent-list.ts | N/A |
| agent-verify.ts | N/A | scripts/agent-verify.ts | N/A |
| agent.d.ts | N/A | scripts/node_modules/undici-types/agent.d.ts | url |
| analyze-git-history.ts | 1.0.0 | scripts/analyze-git-history.ts | child_process |
| api.d.ts | N/A | scripts/node_modules/undici-types/api.d.ts | stream, url |
| archive-memory.ts | N/A | scripts/archive-memory.ts | N/A |
| assert.d.ts | N/A | scripts/node_modules/@types/node/assert.d.ts | N/A |
| async_hooks.d.ts | N/A | scripts/node_modules/@types/node/async_hooks.d.ts | N/A |
| audit.ts | 2.5.3 | scripts/audit.ts | bun |
| auto-executor.ts | N/A | scripts/lib/auto-executor.ts | N/A |
| balanced-pool.d.ts | N/A | scripts/node_modules/undici-types/balanced-pool.d.ts | url |
| buffer.buffer.d.ts | N/A | scripts/node_modules/@types/node/buffer.buffer.d.ts | N/A |
| buffer.buffer.d.ts | N/A | scripts/node_modules/@types/node/ts5.6/buffer.buffer.d.ts | N/A |
| buffer.d.ts | N/A | scripts/node_modules/@types/node/buffer.d.ts | N/A |
| cache.d.ts | N/A | scripts/node_modules/undici-types/cache.d.ts | N/A |
| check-pm-approval.ts | N/A | scripts/check-pm-approval.ts | N/A |
| checkpoint-manager.ts | N/A | scripts/lib/checkpoint-manager.ts | N/A |
| child_process.d.ts | N/A | scripts/node_modules/@types/node/child_process.d.ts | N/A |
| clear-pm-approval.ts | N/A | scripts/clear-pm-approval.ts | N/A |
| client.d.ts | N/A | scripts/node_modules/undici-types/client.d.ts | tls, url |
| cluster.d.ts | N/A | scripts/node_modules/@types/node/cluster.d.ts | N/A |
| connector.d.ts | N/A | scripts/node_modules/undici-types/connector.d.ts | net, tls |
| console.d.ts | N/A | scripts/node_modules/@types/node/console.d.ts | N/A |
| constants.d.ts | N/A | scripts/node_modules/@types/node/constants.d.ts | N/A |
| consumers.d.ts | N/A | scripts/node_modules/@types/node/stream/consumers.d.ts | N/A |
| content-type.d.ts | N/A | scripts/node_modules/undici-types/content-type.d.ts | N/A |
| cookies.d.ts | N/A | scripts/node_modules/undici-types/cookies.d.ts | N/A |
| crypto.d.ts | N/A | scripts/node_modules/@types/node/crypto.d.ts | N/A |
| dev-sync.ts | N/A | scripts/dev-sync.ts | bun |
| dgram.d.ts | N/A | scripts/node_modules/@types/node/dgram.d.ts | N/A |
| diagnostics_channel.d.ts | N/A | scripts/node_modules/@types/node/diagnostics_channel.d.ts | N/A |
| diagnostics-channel.d.ts | N/A | scripts/node_modules/undici-types/diagnostics-channel.d.ts | net, url |
| dispatch-parallel.ts | N/A | scripts/dispatch-parallel.ts | N/A |
| dispatch-serial.ts | N/A | scripts/dispatch-serial.ts | N/A |
| dispatch.ts | N/A | scripts/dispatch.ts | N/A |
| dispatcher.d.ts | N/A | scripts/node_modules/undici-types/dispatcher.d.ts | buffer, events, stream, url |
| disposable.d.ts | N/A | scripts/node_modules/@types/node/compatibility/disposable.d.ts | N/A |
| dns.d.ts | N/A | scripts/node_modules/@types/node/dns.d.ts | N/A |
| domain-config.ts | N/A | scripts/domain-config.ts | N/A |
| domain.d.ts | N/A | scripts/node_modules/@types/node/domain.d.ts | N/A |
| domexception.d.ts | N/A | scripts/node_modules/@types/node/web-globals/domexception.d.ts | N/A |
| encoding-utils.ts | N/A | scripts/lib/encoding-utils.ts | fs, path |
| env-http-proxy-agent.d.ts | N/A | scripts/node_modules/undici-types/env-http-proxy-agent.d.ts | N/A |
| error-handling.ts | N/A | scripts/lib/error-handling.ts | N/A |
| errors.d.ts | N/A | scripts/node_modules/undici-types/errors.d.ts | N/A |
| events.d.ts | N/A | scripts/node_modules/@types/node/events.d.ts | N/A |
| events.d.ts | N/A | scripts/node_modules/@types/node/web-globals/events.d.ts | N/A |
| eventsource.d.ts | N/A | scripts/node_modules/undici-types/eventsource.d.ts | N/A |
| fetch-legalize.ts | N/A | scripts/fetch-legalize.ts | child_process, fs, path |
| fetch.d.ts | N/A | scripts/node_modules/@types/node/web-globals/fetch.d.ts | undici-types |
| fetch.d.ts | N/A | scripts/node_modules/undici-types/fetch.d.ts | buffer, stream, url |
| file.d.ts | N/A | scripts/node_modules/undici-types/file.d.ts | buffer |
| filereader.d.ts | N/A | scripts/node_modules/undici-types/filereader.d.ts | buffer |
| formdata.d.ts | N/A | scripts/node_modules/undici-types/formdata.d.ts | N/A |
| fs.d.ts | N/A | scripts/node_modules/@types/node/fs.d.ts | N/A |
| gen-pr-body.ts | N/A | scripts/gen-pr-body.ts | bun |
| generate-scripts-readme.ts | N/A | scripts/generate-scripts-readme.ts | N/A |
| generate-version-manifest.ts | 1.0.1 | scripts/generate-version-manifest.ts | bun |
| global-dispatcher.d.ts | N/A | scripts/node_modules/undici-types/global-dispatcher.d.ts | N/A |
| global-origin.d.ts | N/A | scripts/node_modules/undici-types/global-origin.d.ts | N/A |
| globals.d.ts | N/A | scripts/node_modules/@types/node/globals.d.ts | N/A |
| globals.typedarray.d.ts | N/A | scripts/node_modules/@types/node/globals.typedarray.d.ts | N/A |
| globals.typedarray.d.ts | N/A | scripts/node_modules/@types/node/ts5.6/globals.typedarray.d.ts | N/A |
| handlers.d.ts | N/A | scripts/node_modules/undici-types/handlers.d.ts | N/A |
| header.d.ts | N/A | scripts/node_modules/undici-types/header.d.ts | N/A |
| http.d.ts | N/A | scripts/node_modules/@types/node/http.d.ts | N/A |
| http2.d.ts | N/A | scripts/node_modules/@types/node/http2.d.ts | N/A |
| https.d.ts | N/A | scripts/node_modules/@types/node/https.d.ts | N/A |
| index.d.ts | N/A | scripts/node_modules/@types/js-yaml/index.d.ts | N/A |
| index.d.ts | N/A | scripts/node_modules/@types/node/compatibility/index.d.ts | N/A |
| index.d.ts | N/A | scripts/node_modules/@types/node/index.d.ts | N/A |
| index.d.ts | N/A | scripts/node_modules/@types/node/ts5.6/index.d.ts | N/A |
| index.d.ts | N/A | scripts/node_modules/undici-types/index.d.ts | N/A |
| indexable.d.ts | N/A | scripts/node_modules/@types/node/compatibility/indexable.d.ts | N/A |
| inspector.generated.d.ts | N/A | scripts/node_modules/@types/node/inspector.generated.d.ts | N/A |
| interceptors.d.ts | N/A | scripts/node_modules/undici-types/interceptors.d.ts | N/A |
| iterators.d.ts | N/A | scripts/node_modules/@types/node/compatibility/iterators.d.ts | N/A |
| lib.d.ts | N/A | scripts/node_modules/typescript/lib/lib.d.ts | N/A |
| lib.decorators.d.ts | N/A | scripts/node_modules/typescript/lib/lib.decorators.d.ts | N/A |
| lib.decorators.legacy.d.ts | N/A | scripts/node_modules/typescript/lib/lib.decorators.legacy.d.ts | N/A |
| lib.dom.asynciterable.d.ts | N/A | scripts/node_modules/typescript/lib/lib.dom.asynciterable.d.ts | N/A |
| lib.dom.d.ts | N/A | scripts/node_modules/typescript/lib/lib.dom.d.ts | N/A |
| lib.dom.iterable.d.ts | N/A | scripts/node_modules/typescript/lib/lib.dom.iterable.d.ts | N/A |
| lib.es2015.collection.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2015.collection.d.ts | N/A |
| lib.es2015.core.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2015.core.d.ts | N/A |
| lib.es2015.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2015.d.ts | N/A |
| lib.es2015.generator.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2015.generator.d.ts | N/A |
| lib.es2015.iterable.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2015.iterable.d.ts | N/A |
| lib.es2015.promise.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2015.promise.d.ts | N/A |
| lib.es2015.proxy.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2015.proxy.d.ts | N/A |
| lib.es2015.reflect.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2015.reflect.d.ts | N/A |
| lib.es2015.symbol.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2015.symbol.d.ts | N/A |
| lib.es2015.symbol.wellknown.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts | N/A |
| lib.es2016.array.include.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2016.array.include.d.ts | N/A |
| lib.es2016.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2016.d.ts | N/A |
| lib.es2016.full.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2016.full.d.ts | N/A |
| lib.es2016.intl.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2016.intl.d.ts | N/A |
| lib.es2017.arraybuffer.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2017.arraybuffer.d.ts | N/A |
| lib.es2017.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2017.d.ts | N/A |
| lib.es2017.date.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2017.date.d.ts | N/A |
| lib.es2017.full.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2017.full.d.ts | N/A |
| lib.es2017.intl.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2017.intl.d.ts | N/A |
| lib.es2017.object.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2017.object.d.ts | N/A |
| lib.es2017.sharedmemory.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2017.sharedmemory.d.ts | N/A |
| lib.es2017.string.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2017.string.d.ts | N/A |
| lib.es2017.typedarrays.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2017.typedarrays.d.ts | N/A |
| lib.es2018.asyncgenerator.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts | N/A |
| lib.es2018.asynciterable.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts | N/A |
| lib.es2018.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2018.d.ts | N/A |
| lib.es2018.full.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2018.full.d.ts | N/A |
| lib.es2018.intl.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2018.intl.d.ts | N/A |
| lib.es2018.promise.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2018.promise.d.ts | N/A |
| lib.es2018.regexp.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2018.regexp.d.ts | N/A |
| lib.es2019.array.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2019.array.d.ts | N/A |
| lib.es2019.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2019.d.ts | N/A |
| lib.es2019.full.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2019.full.d.ts | N/A |
| lib.es2019.intl.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2019.intl.d.ts | N/A |
| lib.es2019.object.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2019.object.d.ts | N/A |
| lib.es2019.string.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2019.string.d.ts | N/A |
| lib.es2019.symbol.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2019.symbol.d.ts | N/A |
| lib.es2020.bigint.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2020.bigint.d.ts | N/A |
| lib.es2020.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2020.d.ts | N/A |
| lib.es2020.date.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2020.date.d.ts | N/A |
| lib.es2020.full.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2020.full.d.ts | N/A |
| lib.es2020.intl.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2020.intl.d.ts | N/A |
| lib.es2020.number.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2020.number.d.ts | N/A |
| lib.es2020.promise.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2020.promise.d.ts | N/A |
| lib.es2020.sharedmemory.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2020.sharedmemory.d.ts | N/A |
| lib.es2020.string.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2020.string.d.ts | N/A |
| lib.es2020.symbol.wellknown.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2020.symbol.wellknown.d.ts | N/A |
| lib.es2021.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2021.d.ts | N/A |
| lib.es2021.full.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2021.full.d.ts | N/A |
| lib.es2021.intl.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2021.intl.d.ts | N/A |
| lib.es2021.promise.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2021.promise.d.ts | N/A |
| lib.es2021.string.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2021.string.d.ts | N/A |
| lib.es2021.weakref.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2021.weakref.d.ts | N/A |
| lib.es2022.array.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2022.array.d.ts | N/A |
| lib.es2022.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2022.d.ts | N/A |
| lib.es2022.error.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2022.error.d.ts | N/A |
| lib.es2022.full.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2022.full.d.ts | N/A |
| lib.es2022.intl.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2022.intl.d.ts | N/A |
| lib.es2022.object.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2022.object.d.ts | N/A |
| lib.es2022.regexp.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2022.regexp.d.ts | N/A |
| lib.es2022.string.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2022.string.d.ts | N/A |
| lib.es2023.array.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2023.array.d.ts | N/A |
| lib.es2023.collection.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2023.collection.d.ts | N/A |
| lib.es2023.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2023.d.ts | N/A |
| lib.es2023.full.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2023.full.d.ts | N/A |
| lib.es2023.intl.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2023.intl.d.ts | N/A |
| lib.es2024.arraybuffer.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2024.arraybuffer.d.ts | N/A |
| lib.es2024.collection.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2024.collection.d.ts | N/A |
| lib.es2024.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2024.d.ts | N/A |
| lib.es2024.full.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2024.full.d.ts | N/A |
| lib.es2024.object.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2024.object.d.ts | N/A |
| lib.es2024.promise.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2024.promise.d.ts | N/A |
| lib.es2024.regexp.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2024.regexp.d.ts | N/A |
| lib.es2024.sharedmemory.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2024.sharedmemory.d.ts | N/A |
| lib.es2024.string.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es2024.string.d.ts | N/A |
| lib.es5.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es5.d.ts | N/A |
| lib.es6.d.ts | N/A | scripts/node_modules/typescript/lib/lib.es6.d.ts | N/A |
| lib.esnext.array.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.array.d.ts | N/A |
| lib.esnext.collection.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.collection.d.ts | N/A |
| lib.esnext.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.d.ts | N/A |
| lib.esnext.decorators.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.decorators.d.ts | N/A |
| lib.esnext.disposable.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.disposable.d.ts | N/A |
| lib.esnext.error.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.error.d.ts | N/A |
| lib.esnext.float16.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.float16.d.ts | N/A |
| lib.esnext.full.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.full.d.ts | N/A |
| lib.esnext.intl.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.intl.d.ts | N/A |
| lib.esnext.iterator.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.iterator.d.ts | N/A |
| lib.esnext.promise.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.promise.d.ts | N/A |
| lib.esnext.sharedmemory.d.ts | N/A | scripts/node_modules/typescript/lib/lib.esnext.sharedmemory.d.ts | N/A |
| lib.scripthost.d.ts | N/A | scripts/node_modules/typescript/lib/lib.scripthost.d.ts | N/A |
| lib.webworker.asynciterable.d.ts | N/A | scripts/node_modules/typescript/lib/lib.webworker.asynciterable.d.ts | N/A |
| lib.webworker.d.ts | N/A | scripts/node_modules/typescript/lib/lib.webworker.d.ts | N/A |
| lib.webworker.importscripts.d.ts | N/A | scripts/node_modules/typescript/lib/lib.webworker.importscripts.d.ts | N/A |
| lib.webworker.iterable.d.ts | N/A | scripts/node_modules/typescript/lib/lib.webworker.iterable.d.ts | N/A |
| mcp-cache.ts | N/A | scripts/lib/mcp-cache.ts | N/A |
| mock-agent.d.ts | N/A | scripts/node_modules/undici-types/mock-agent.d.ts | N/A |
| mock-client.d.ts | N/A | scripts/node_modules/undici-types/mock-client.d.ts | N/A |
| mock-errors.d.ts | N/A | scripts/node_modules/undici-types/mock-errors.d.ts | N/A |
| mock-interceptor.d.ts | N/A | scripts/node_modules/undici-types/mock-interceptor.d.ts | N/A |
| mock-pool.d.ts | N/A | scripts/node_modules/undici-types/mock-pool.d.ts | N/A |
| module.d.ts | N/A | scripts/node_modules/@types/node/module.d.ts | N/A |
| net.d.ts | N/A | scripts/node_modules/@types/node/net.d.ts | N/A |
| new-domain.ts | N/A | scripts/new-domain.ts | N/A |
| os.d.ts | N/A | scripts/node_modules/@types/node/os.d.ts | N/A |
| patch.d.ts | N/A | scripts/node_modules/undici-types/patch.d.ts | N/A |
| path.d.ts | N/A | scripts/node_modules/@types/node/path.d.ts | N/A |
| perf_hooks.d.ts | N/A | scripts/node_modules/@types/node/perf_hooks.d.ts | N/A |
| pipeline-state.ts | N/A | scripts/lib/pipeline-state.ts | fs, path |
| plan-parser.ts | N/A | scripts/lib/plan-parser.ts | fs, js-yaml |
| platform-context.ts | N/A | scripts/lib/platform-context.ts | bun, os |
| platform-dispatcher.ts | N/A | scripts/lib/platform-dispatcher.ts | N/A |
| pool-stats.d.ts | N/A | scripts/node_modules/undici-types/pool-stats.d.ts | N/A |
| pool.d.ts | N/A | scripts/node_modules/undici-types/pool.d.ts | url |
| process.d.ts | N/A | scripts/node_modules/@types/node/process.d.ts | N/A |
| promises.d.ts | N/A | scripts/node_modules/@types/node/dns/promises.d.ts | N/A |
| promises.d.ts | N/A | scripts/node_modules/@types/node/fs/promises.d.ts | N/A |
| promises.d.ts | N/A | scripts/node_modules/@types/node/readline/promises.d.ts | N/A |
| promises.d.ts | N/A | scripts/node_modules/@types/node/stream/promises.d.ts | N/A |
| promises.d.ts | N/A | scripts/node_modules/@types/node/timers/promises.d.ts | N/A |
| proxy-agent.d.ts | N/A | scripts/node_modules/undici-types/proxy-agent.d.ts | N/A |
| punycode.d.ts | N/A | scripts/node_modules/@types/node/punycode.d.ts | N/A |
| qa-gate.ts | N/A | scripts/qa-gate.ts | bun |
| querystring.d.ts | N/A | scripts/node_modules/@types/node/querystring.d.ts | N/A |
| readable.d.ts | N/A | scripts/node_modules/undici-types/readable.d.ts | buffer, stream |
| readline.d.ts | N/A | scripts/node_modules/@types/node/readline.d.ts | N/A |
| readme-lifecycle-audit.ts | N/A | scripts/readme-lifecycle-audit.ts | N/A |
| repl.d.ts | N/A | scripts/node_modules/@types/node/repl.d.ts | N/A |
| retry-agent.d.ts | N/A | scripts/node_modules/undici-types/retry-agent.d.ts | N/A |
| retry-handler.d.ts | N/A | scripts/node_modules/undici-types/retry-handler.d.ts | N/A |
| retry-handler.ts | N/A | scripts/retry-handler.ts | N/A |
| safety-audit.ts | N/A | scripts/safety-audit.ts | js-yaml |
| sea.d.ts | N/A | scripts/node_modules/@types/node/sea.d.ts | N/A |
| skill-dependency-analysis.ts | N/A | scripts/skill-dependency-analysis.ts | N/A |
| skill-lifecycle-audit.ts | N/A | scripts/skill-lifecycle-audit.ts | N/A |
| start-mcp.ts | N/A | scripts/start-mcp.ts | child_process, path |
| stream.d.ts | N/A | scripts/node_modules/@types/node/stream.d.ts | N/A |
| strict.d.ts | N/A | scripts/node_modules/@types/node/assert/strict.d.ts | N/A |
| string_decoder.d.ts | N/A | scripts/node_modules/@types/node/string_decoder.d.ts | N/A |
| sync-agent-status.ts | N/A | scripts/sync-agent-status.ts | N/A |
| sync-md.ts | 1.2.0 | scripts/sync-md.ts | N/A |
| sync-skill-status.ts | N/A | scripts/sync-skill-status.ts | N/A |
| sync-skills.ts | N/A | scripts/sync-skills.ts | N/A |
| team-builder.ts | N/A | scripts/team-builder.ts | fs, path |
| test-chemical-handling-profile.ts | N/A | scripts/test-chemical-handling-profile.ts | js-yaml |
| test-cross-domain-integration.ts | N/A | scripts/test-cross-domain-integration.ts | js-yaml |
| test-domain-scenarios.ts | N/A | scripts/test-domain-scenarios.ts | N/A |
| test-pharma-general-profile.ts | N/A | scripts/test-pharma-general-profile.ts | js-yaml |
| test-runner.ts | N/A | scripts/test-runner.ts | child_process, fs, path |
| test.d.ts | N/A | scripts/node_modules/@types/node/test.d.ts | N/A |
| timers.d.ts | N/A | scripts/node_modules/@types/node/timers.d.ts | N/A |
| tls.d.ts | N/A | scripts/node_modules/@types/node/tls.d.ts | N/A |
| trace_events.d.ts | N/A | scripts/node_modules/@types/node/trace_events.d.ts | N/A |
| translate-readme.ts | N/A | scripts/translate-readme.ts | bun, fs, path |
| tsserverlibrary.d.ts | N/A | scripts/node_modules/typescript/lib/tsserverlibrary.d.ts | N/A |
| tty.d.ts | N/A | scripts/node_modules/@types/node/tty.d.ts | N/A |
| typescript.d.ts | N/A | scripts/node_modules/typescript/lib/typescript.d.ts | N/A |
| url.d.ts | N/A | scripts/node_modules/@types/node/url.d.ts | N/A |
| util.d.ts | N/A | scripts/node_modules/@types/node/util.d.ts | N/A |
| util.d.ts | N/A | scripts/node_modules/undici-types/util.d.ts | N/A |
| v8.d.ts | N/A | scripts/node_modules/@types/node/v8.d.ts | N/A |
| validate-agents.ts | N/A | scripts/validate-agents.ts | N/A |
| validate-doc-folder.ts | N/A | scripts/validate-doc-folder.ts | fs, path |
| validate-md-language.ts | 1.4.1 | scripts/validate-md-language.ts | fs, js-yaml |
| validate-model-registry.ts | N/A | scripts/validate-model-registry.ts | N/A |
| validate-skills.ts | N/A | scripts/validate-skills.ts | N/A |
| verify-agent-deliverables.ts | N/A | scripts/verify-agent-deliverables.ts | fs |
| verify-memory.ts | N/A | scripts/verify-memory.ts | fs, path |
| verify-readme-sync.ts | 1.1.1 | scripts/verify-readme-sync.ts | bun, fs, path |
| verify-skills.ts | N/A | scripts/verify-skills.ts | N/A |
| vm.d.ts | N/A | scripts/node_modules/@types/node/vm.d.ts | N/A |
| wasi.d.ts | N/A | scripts/node_modules/@types/node/wasi.d.ts | N/A |
| web.d.ts | N/A | scripts/node_modules/@types/node/stream/web.d.ts | N/A |
| webidl.d.ts | N/A | scripts/node_modules/undici-types/webidl.d.ts | N/A |
| websocket.d.ts | N/A | scripts/node_modules/undici-types/websocket.d.ts | buffer, worker_threads |
| worker_threads.d.ts | N/A | scripts/node_modules/@types/node/worker_threads.d.ts | N/A |
| zlib.d.ts | N/A | scripts/node_modules/@types/node/zlib.d.ts | N/A |

---

## Commands

| Name | File | Platform | Skill Integration |
|------|------|----------|-------------------|
| changelog | .claude/commands/changelog.md | both | N/A |
| commit-push-pr | .claude/commands/commit-push-pr.md | both | N/A |
| meeting | .claude/commands/meeting.md | both | N/A |
| memlog | .claude/commands/memlog.md | both | N/A |
| new-task | .claude/commands/new-task.md | both | N/A |
| sync | .claude/commands/sync.md | claude | N/A |

---

## Platform Parity Status

**Checked**: Claude (.claude/) vs Gemini (.gemini/)

- **Commands with parity**: 5 / 6
- **Skills with parity**: 6 / 17

---

## Drift Detection

⚠️ **Drift detected**:

- Skill agent-lifecycle-manager has no triggers defined
- Skill agent-lifecycle-manager has no triggers defined
- Skill api-documentation has no triggers defined
- Skill documentation-writing has no triggers defined
- Skill finishing-a-development-branch has no triggers defined
- Skill legalize-kr-sync has no triggers defined
- Skill meeting-facilitation has no triggers defined
- Skill meeting-facilitation has no triggers defined
- Skill platform-command-lifecycle-manager has no triggers defined
- Skill platform-skill-lifecycle-manager has no triggers defined
- Skill project-review has no triggers defined
- Skill research-analysis has no triggers defined
- Skill script-lifecycle-manager has no triggers defined
- Skill simulate-project-creation has no triggers defined
- Skill skill-lifecycle-manager has no triggers defined
- Skill team-builder has no triggers defined
- Skill translate has no triggers defined
- Command changelog not integrated as a skill
- Command commit-push-pr not integrated as a skill
- Command meeting not integrated as a skill
- Command memlog not integrated as a skill
- Command new-task not integrated as a skill
- Command sync not integrated as a skill
