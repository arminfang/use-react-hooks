// 保持对最新值的引用，避免闭包问题
// 1. 创建一个始终指向最新值的引用对象
// 2. 解决异步回调中访问到过期状态的问题
// 3. 确保在useEffect等钩子中始终能获取到最新的值
import { useRef } from 'react';

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref.current;
}

export default useLatest;
