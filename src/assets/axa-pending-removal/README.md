Carried over from activationUI so the app compiles unchanged on the first
commit. Health Assessments has no AXA arm: this whole directory, and the AXA
screens in App.tsx that import from it, come out in the pruning pass. If this
note is still here, that pass has not happened.
