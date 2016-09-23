#include "node.h"
#include "v8.h"
#include "env.h"
#include "env-inl.h"

namespace node {
namespace types {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Local;
using v8::Object;
using v8::Value;

#define VALUE_METHOD_MAP(V)                                                   \
  V(isArgumentsObject, IsArgumentsObject)                                     \
  V(isArray, IsArray)                                                         \
  V(isArrayBuffer, IsArrayBuffer)                                             \
  V(isArrayBufferView, IsArrayBufferView)                                     \
  V(isBoolean, IsBoolean)                                                     \
  V(isBooleanObject, IsBooleanObject)                                         \
  V(isDataView, IsDataView)                                                   \
  V(isDate, IsDate)                                                           \
  V(isFalse, IsFalse)                                                         \
  V(isFloat32Array, IsFloat32Array)                                           \
  V(isFloat64Array, IsFloat64Array)                                           \
  V(isFunction, IsFunction)                                                   \
  V(isGeneratorFunction, IsGeneratorFunction)                                 \
  V(isGeneratorObject, IsGeneratorObject)                                     \
  V(isInt32, IsInt32)                                                         \
  V(isInt8Array, IsInt8Array)                                                 \
  V(isInt16Array, IsInt16Array)                                               \
  V(isInt32Array, IsInt32Array)                                               \
  V(isMap, IsMap)                                                             \
  V(isMapIterator, IsMapIterator)                                             \
  V(isNativeError, IsNativeError)                                             \
  V(isNull, IsNull)                                                           \
  V(isNumber, IsNumber)                                                       \
  V(isNumberObject, IsNumberObject)                                           \
  V(isObject, IsObject)                                                       \
  V(isPromise, IsPromise)                                                     \
  V(isProxy, IsProxy)                                                         \
  V(isRegExp, IsRegExp)                                                       \
  V(isSet, IsSet)                                                             \
  V(isSetIterator, IsSetIterator)                                             \
  V(isSharedArrayBuffer, IsSharedArrayBuffer)                                 \
  V(isString, IsString)                                                       \
  V(isStringObject, IsStringObject)                                           \
  V(isSymbol, IsSymbol)                                                       \
  V(isSymbolObject, IsSymbolObject)                                           \
  V(isTrue, IsTrue)                                                           \
  V(isTypedArray, IsTypedArray)                                               \
  V(isUint32, IsUint32)                                                       \
  V(isUint8Array, IsUint8Array)                                               \
  V(isUint8ClampedArray, IsUint8ClampedArray)                                 \
  V(isUint16Array, IsUint16Array)                                             \
  V(isUint32Array, IsUint32Array)                                             \
  V(isUndefined, IsUndefined)                                                 \
  V(isWeakMap, IsWeakMap)                                                     \
  V(isWeakSet, IsWeakSet)


#define V(_, ucname) \
  static void ucname(const FunctionCallbackInfo<Value>& args) {               \
    CHECK_EQ(1, args.Length());                                               \
    args.GetReturnValue().Set(args[0]->ucname());                             \
  }

  VALUE_METHOD_MAP(V)
#undef V

void Initialize(Local<Object> target,
                Local<Value> unused,
                Local<Context> context) {
  Environment* env = Environment::GetCurrent(context);

#define V(lcname, ucname) env->SetMethod(target, #lcname, ucname);
  VALUE_METHOD_MAP(V)
#undef V
}

}  // namespace types
}  // namespace node

NODE_MODULE_CONTEXT_AWARE_BUILTIN(types, node::types::Initialize)
