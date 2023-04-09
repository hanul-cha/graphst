# Graphst

<a href="https://www.npmjs.com/package/graphst"><img alt="Version" src="https://img.shields.io/npm/v/graphst.svg?style=flat-square" /></a>

## Origin

<b>ME:</b><br />팀원들이나 동료들이 왜 이름을 Graphst 라고 지었냐고 물어보면 멋있는 답을 하고 싶은데 뭐라고 말해야해??
<br />
<br />
<b>GPT:</b><br />Graphst라는 이름에는 "Graph"와 "st" 라는 두 가지 요소가 결합되어 있습니다.<br />"Graph"는 GraphQL과 같은 그래프 형태의 데이터 구조와 관련이 있고, "st"는 "structure" 또는 "system"과 같은 단어를 축약한 것으로서, 이 프레임워크가 데이터 구조와 시스템을 효율적으로 관리하고 구성하는 데에 유용하다는 의미가 담겨있습니다.<br />
또한 "Graphst"는 "Graph"와 "Growth"의 유사한 발음을 가지고 있어, 이 프레임워크가 더 큰 규모의 프로젝트를 구성하고 성장하는 데에도 도움이 될 것이라는 의미도 담겨 있습니다.

## Installation

```bash
npm install graphst --save
```


provider에 명시한 친구들은 모두 인스턴스화 되어 관리됩니다.
inject데코레이터를 사용한 프로퍼티는 provider에 명시된 객체만 주입받을 수 있습니다.
nest의 인터셉트같은건 provider에 넣을 객체에 injectable을 감싸 사용합니다.
nest처럼 모듈단위로 인터셉트를 걸고 싶으면 걍 모듈안에 넣을 객체의 injectable에 각자 모두 명시해서 쓰셈
guard절은 똑같이 메서드 단위로 걸수 있게 만들겁니다.

nest를 쓰면서 쓰는것만 쓸거같은데 너무 복잡한 느낌이였습니다. 사실 모듈이 잘 관리 되고 있는지도 모르겠음
이 프로젝트는 nest보다 간단하고 편하게 바로 연결해서 사용할 수 있는 graphql서버를 목표로 합니다.
일단 http, graphql만 지원할것이고 다른건 지원안할겁니다.
나도 안쓸거같아서...